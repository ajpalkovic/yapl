!function($) {
  var Token = klass({
    initialize: function Token(options) {
      this.value = options.value;
      this.type = options.type;
      this.optional = options.optional;
      this.ignore = options.ignore;
    }
  });


  /**
   *  Basically this function takes an array of 'tokens', which are really just 2-element
   *  arrays containing the token's value and the name of the token for parsing
   *  purposes, and
   *    - escapes the token's value for regular expression reserved characters if specified
   *    - compiles all the values into one big regular expression
   */
  function compileRegex(tokens, escape) {
    var regex = [];

    for (var i = 0, len = tokens.length; i < len; ++i) {
      var regexString = escape ? tokens[i][0].replace(/(\\|\^|\$|\{|\}|\[|\]|\(|\)|\.|\*|\+|\?|\|)/g, '\\$1') : tokens[i][0];
      regex.push('(?:' + regexString + ')');
    }

    var tokenRegex = regex.join('|');
    return '(?:' + tokenRegex + ')';
  }

  /**
   *  Given a list of tokens and an optional token lookup table, this will basically create a lookup
   *  of token values to a function that merely returns a token with that type.  The lexer uses the
   *  lookup created here to match a lexed piece of source to a particular token type.  Tokens with
   *  non-simple (i.e., the matched source code requires more logic to determine the corresponding token)
   *  are not entered into the lookups.
   */
  function prepare(tokens, lookup) {
    var lookup = lookup || {};

    for (var i = 0, len = tokens.length; i < len; ++i) {
      (function(value) {
        lookup[value[0]] = (typeof value[1] === 'function') ? value[1] : function() {
          return Token[value[1]] = new Token({
            value: value[0],
            type: value[1],
            optional: (value[2] === true)
          });
        };

        // Make sure to create every token so they can be accessed statically.
        lookup[value[0]]();
      })(tokens[i]);
    }

    return lookup;
  }

  var regexes = {
    NUMERIC_LITERAL: '(?:((?:0[0-7]+))|((?:0x[a-fA-F0-9]+))|((?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE]\\d+)?))',
    IDENTIFIER: '((?:[a-zA-Z_\\$][_a-zA-Z0-9\\$]*))',
    STRING_LITERAL: '(\'|")',
    FORWARD_SLASH: '\\/',
    WHITESPACE: '((?:[^\\S\\n]+))', // Does not match newlines
    PLUS_OR_MINUS: '(\\+|-)',
    OPEN_PAREN: '(\\()'
  };

  // Language reserved words
  var reserved = [
    ['function', 'FUNCTION'],
    ['def', 'DEF'],
    ['var', 'VAR'],
    ['if', 'IF'],
    ['instanceof', 'INSTANCEOF'],
    ['in', 'IN'],
    ['else', 'ELSE'],
    ['for', 'FOR'],
    ['while', 'WHILE'],
    ['do', 'DO'],
    ['this', 'THIS'],
    ['return', 'RETURN'],
    ['throw', 'THROW'],
    ['typeof', 'TYPEOF'],
    ['try', 'TRY'],
    ['catch', 'CATCH'],
    ['finally', 'FINALLY'],
    ['void', 'VOID'],
    ['null', 'NULL'],
    ['new', 'NEW'],
    ['delete', 'DELETE'],
    ['switch', 'SWITCH'],
    ['case', 'CASE'],
    ['break', 'BREAK'],
    ['default', 'DEFAULT'],
    ['false', 'FALSE'],
    ['true', 'TRUE'],
    ['super', 'SUPER'],
    ['undefined', 'UNDEFINED'],
    ['debugger', 'DEBUGGER'],
    ['gets', 'GETS'],
    ['sets', 'SETS'],
    ['accesses', 'ACCESSES'],
    ['extends', 'EXTENDS'],
    ['static', 'STATIC'],
    ['readonly', 'READONLY'],
    ['end', 'END'],
    ['unless', 'UNLESS'],
    ['until', 'UNTIL'],
    ['always', 'ALWAYS'],
    ['class', 'CLASS'],
    ['closure', 'CLOSURE'],
    ['at', 'AT'],
    ['like', 'LIKE'],
    ['unlike', 'UNLIKE']
  ];

  //  Note: tokens that are substrings of other tokens must be placed below those tokens
  //        in this list.  (i.e., = must come after ==)
  var tokens = [
    ['>>>=', 'LOGICAL_SHIFTR_EQUAL'],
    ['>>>', 'LOGICAL_RSHIFT'],
    ['<=>', 'COMPARE_TO'],
    ['...', 'ELLIPSES'],
    ['||=', 'CONDITIONAL_EQUALS'],
    ['<<=', 'SHIFTL_EQUALS'],
    ['>>=', 'SHIFTR_EQUALS'],
    ['**=', 'EXPONENTIATION_EQUALS'],
    ['++', 'INCREMENT'],
    ['--', 'DECREMENT'],
    ['==', 'EQUAL'],
    ['*=', 'MUL_EQUALS'],
    ['/=', 'DIV_EQUALS'],
    ['%=', 'MOD_EQUALS'],
    ['+=', 'PLUS_EQUALS'],
    ['-=', 'MINUS_EQUALS'],
    ['&=', 'AND_EQUALS'],
    ['|=', 'XOR_EQUALS'],
    ['^=', 'OR_EQUALS'],
    ['!=', 'NOT_EQUAL'],
    ['<=', 'LESS_THAN_EQUAL'],
    ['>=', 'GREATER_THAN_EQUAL'],
    ['&&', 'LOGICAL_AND'],
    ['||', 'LOGICAL_OR'],
    ['<<', 'LSHIFT'],
    ['>>', 'RSHIFT'],
    ['**', 'EXPONENTIATION'],
    ['..', 'DOT_DOT'],
    // ['(', 'OPEN_PAREN'],
    [')', 'CLOSE_PAREN'],
    ['[', 'OPEN_BRACKET'],
    [']', 'CLOSE_BRACKET'],
    ['{', 'OPEN_BRACE'],
    ['}', 'CLOSE_BRACE'],
    ['.', 'DOT'],
    // ['+', 'PLUS'],
    // ['-', 'MINUS'],
    ['*', 'ASTERISK'],
    ['%', 'MODULUS'],
    ['?', 'QUESTION'],
    [',', 'COMMA'],
    [';', 'SEMI'],
    [':', 'COLON'],
    ['=', 'ASSIGN'],
    ['<', 'LESS_THAN'],
    ['>', 'GREATER_THAN'],
    ['!', 'LOGICAL_NOT'],
    ['&', 'BITWISE_AND'],
    ['|', 'BITWISE_OR'],
    ['~', 'BITWISE_NOT'],
    ['^', 'XOR'],
    ['@', 'MEMBER'],
    ['#', 'BIND'],
    ['\\', 'BACK_SLASH'],
    ['\n', 'NEWLINE', true]
  ];

  // These are the types of the tokens that cannot preceed a regular expression
  // literal in the source.  This tries to solve the inherent ambiguity between
  // the division operator and the regular expression literal in ECMA Script.
  var nonPreRegexTokens = {
    'REGEX_LITERAL': true,
    'NUMERIC_LITERAL': true,
    'STRING_LITERAL': true
  };

  var advanced = [

    // NUMERIC_LITERAL
    [
      regexes.NUMERIC_LITERAL,
      function(matches, string, tokens) {
        var number = 0;

        if (matches[1]) {
          // It was an octal number
          number = parseInt(matches[0], 8);
        } else if (matches[2]) {
          number = parseInt(matches[0], 16);
          // It has a hex number
        } else if (matches[3]) {
          // It was a decimal number
          number = parseFloat(matches[0]);
        } else {
          return undefined;
        }

        return {
          token: new Token({
            type: 'NUMERIC_LITERAL',
            value: number
          }),

          position: matches[0].length
        };
      }
    ],

    // IDENTIFIER
    [
      regexes.IDENTIFIER,
      function(matches, string, tokens) {
        var token = new Token({
          type: 'IDENTIFIER',
          value: matches[0]
        });

        return {
          token: token,
          position: matches[0].length
        };
      }
    ],

    // STRING_LITERAL
    [
      regexes.STRING_LITERAL,
      function(matches, string, tokens) {
        var quote = matches[1];
        var endQuotePos = 0;

        // Find the closing quote/
        for (var i = matches[0].length, len = string.length; i < len; ++i) {
          if (string[i] === quote) {
            endQuotePos = i;
            break;
          } else if (string[i] === '\\') {
            // Skip whatever the next character is, because it is escaped, and we don't
            // care...
            i++;
          }
        }

        // Well they didn't close the string...
        if (!endQuotePos) return undefined;

        return {
          token: new Token({
            type: 'STRING_LITERAL',
            value: string.substring(0, endQuotePos + 1)
          }),

          position: endQuotePos + 1
        };
      }
    ],

    // SINGLE_LINE_COMMENT, MULTI_LINE_COMMENT, REGEX_LITERAL, and FORWARD_SLASH
    [
      regexes.FORWARD_SLASH,
      function(matches, string, tokens) {

        /**
         *  Finds the end of a multi-line comment, but takes balancing into account.
         *  Where traditional multi-line comments are terminated by a single
         *  star-slash terminator, Yapl comments can be nested within themselves,
         *  and to be closed must be balenced.
         */
        function findMultiCommentEnd(position) {
          for (var i = position + 2, len = string.length; i < len; ++i) {
            if (string[i] === '/' && string[i + 1] === '*') {
              i = findMultiCommentEnd(i);
            }

            if (string[i] === '*' && string[i + 1] === '/') {
              return i + 2;
            }
          }
        }

        /**
         *  Will determine if the regular expression literal trying to be lexed should
         *  be tokenized as such, or as a division operator.  There is an inherent ambiguity
         *  in the language between these two tokens and how they should be scanned.
         *
         *  This will return true iff there is no preceeding token or the preceeding token
         *  is not a token that would lexically preceed a division operator.
         */
        function canBeRegex() {
          var previous = tokens[tokens.length - 1];

          return !(previous && nonPreRegexTokens[previous.type]);
        }

        /**
         *  Tries to match a regex literal from the start of the current string.
         *  Regexes in Yapl can span multiple lines and contain whitespace, so anything
         *  goes for their content.
         *
         *  This wil return undefined if a regular expression literal could not be
         *  lexed from the string.
         */
        function matchRegex() {
          if (!canBeRegex()) return undefined;

          for (var i = 1, len = string.length; i < len; ++i) {
            if (string[i] === '\\') {
              ++i;
              continue;
            }

            if (string[i] === '/') {
              // Because Chrome is lame and doesn't have the equivalent to FF's y regex flag
              // (basically allows you to use lastIndex and ^ so it doesn't do a global match),
              // we use a substring to match flags.
              var rest = string.substring(i + 1);

              // ECMA 262 regex flags are basically identifiers, and are
              // even defined as such.
              var flagsRegex = new RegExp('^' + regexes.IDENTIFIER);

              var matches = flagsRegex.exec(rest);
              var endOfRegex = i + (matches ? matches[1].length : 0) + 1;

              return {
                token: new Token({
                  type: 'REGEX_LITERAL',
                  value: string.substring(0, endOfRegex)
                }),

                position: endOfRegex
              };
            }
          }

          return undefined;
        }

        switch (string[1]) {
          // Single-line comment
          case '/':
            var newlineIndex = string.indexOf('\n');

            // The string may not have had a newline at all, so just go to the end if
            // that is the case.
            var end = newlineIndex >= 0 ? newlineIndex : string.length;

            var comment = string.substring(0, end);

            return {
              token: new Token({
                type: 'SINGLE_LINE_COMMENT',
                ignore: true,
                value: comment
              }),

              position: comment.length
            };

          // Multi-line comment
          case '*':
            // If it wasn't a balanced comment, the whole document from that point
            // on is commented out.
            var commentEnd = findMultiCommentEnd(0) || string.length;

            return {
              token: new Token({
                type: 'MULTI_LINE_COMMENT',
                ignore: true,
                value: string.substring(0, commentEnd + 1)
              }),

              position: commentEnd + 1
            };

          // A regular expression literal cannot begin with a whitespace character.
          // This prevents weird ambiguities between chained divisions separated by
          // whitespace.
          case ' ':
            var invalidWhitespace = true;

          // Well if the character following the first '/' wasn't another '/' or a '*',
          // it can be a valid ECMA 262 regex literal (see http://bclary.com/2004/11/07/#a-7.8.5),
          // or it can simply be the division operator.  Let's find out...
          default:
            var regexToken = !invalidWhitespace && matchRegex();

            return regexToken || {
              token: new Token({
                type: 'FORWARD_SLASH',
              }),

              position: 1
            };
        }
      }
    ],

    // WHITESPACE
    [
      regexes.WHITESPACE,
      function(matches, string) {
        return {
          token: new Token({
            type: 'WHITESPACE',
            optional: true
          }),
          position: matches[0].length
        };
      }
    ],

    // PLUS or MINUS or UNARY_PLUS or UNARY_MINUS
    [
      regexes.PLUS_OR_MINUS,
      function(matches, string) {
        var types = {
          '+': 'PLUS',
          '-': 'MINUS'
        };

        var isBinary = !!string.match(/^(\+|-)\s+/);
        var type = types[matches[0]];

        return {
          token: new Token({
            type: type,
            value: matches[1],
            isBinary: isBinary
          }),
          position: 1
        };
      }
    ],

    // OPEN_PAREN or OPEN_PAREN_ARG
    [
      regexes.OPEN_PAREN,
      function(matches, string, tokens) {
        // These are tokens types that can be followed by an OPEN_PAREN
        // that would signal a function call, and not an expression.
        var preceedingCallTokenTypes = [
          'IDENTIFIER',
          'CLOSE_BRACKET',
          'CLOSE_PAREN',
          'BIND'
        ];

        function isExpressionParen() {
          return tokens.length === 0 || !preceedingCallTokenTypes.include(tokens.last().type);
        }

        if (isExpressionParen()) {
          var token = new Token({
            type: 'OPEN_PAREN',
            value: matches[1]
          });
        } else {
          var token = new Token({
            type: 'OPEN_PAREN_ARG',
            value: matches[1]
          });
        }

        return {
          token: token,
          position: 1
        };
      }
    ]
  ];

  /**
   *  Function that will take a string of matched source that was not in the lookup
   *  of token values to types and try to match it to one of the advanced tokens.
   */
  function identify(string, tokens) {
    for (var i = 0, len = advanced.length; i < len; ++i) {
      var re = new RegExp('^' + advanced[i][0]);
      var matches = string.match(re);

      if (matches) return advanced[i][1](matches, string, tokens);
    }

    return undefined;
  }

  // The appended regular expression ensures that in order for something to be a reserved
  // word, it cannot be part of a valid identifier.  This covers the case where the reserved
  // word appears at the beginning of the identifier...
  var reservedRegex = compileRegex(reserved, true) + '(?![a-zA-Z_0-9])';
  var tokenRegex = compileRegex(tokens, true);

  // ...which is the only case as the regex is only run at the beginning of the string.
  var compiledRe = '^' + compileRegex([[reservedRegex], [tokenRegex]]);

  // We didn't want this to be part of the overall regex because its not actually
  // matched to the source input.  It's really just a placeholder to represent
  // the end of the file. Thererfore, we add it after the regex has been created.
  tokens.push(['<<EOF>>', '<<EOF>>']);
  var typeLookup = prepare(tokens, prepare(reserved));

  Token.regex = compiledRe;
  Token.typeLookup = typeLookup;
  Token.identify = identify;
}(jQuery);
