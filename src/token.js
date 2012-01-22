var Token = (function($) {

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
          return {
            value: value[0],
            type: value[1],
            optional: (value[2] === true)
          };
        };
      })(tokens[i]);
    }

    return lookup;
  }

  var regexes = {
    NUMERIC_LITERAL: '(?:((?:0[0-7]+))|((?:0x[a-fA-F0-9]+))|((?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE]\\d+)?))',
    IDENTIFIER: '((?:[a-zA-Z_\\$][_a-zA-Z0-9\\$]*))',
    STRING_LITERAL: '(\'|")',
    COMMENT_OR_SLASH: '\\/',
    WHITESPACE: '((?:[^\\S\\n]+))' // Does not match newlines
  };

  // Language reserved words
  var reserved = [
    ['function', 'FUNCTION'],
    ['var', 'VAR'],
    ['if', 'IF'],
    ['instanceof', 'INSTANCEOF'],
    ['in', 'IN'],
    ['else', 'ELSE'],
    // ['elseif', 'ELSEIF'],
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
    ['get', 'GET'],
    ['set', 'SET'],
    ['access', 'ACCESS'],
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
    ['unlike', 'UNLIKE'],
  ];

  //  Note: tokens that are substrings of other tokens must be placed below those tokens
  //        in this list.  (i.e., = must come after ==)
  var tokens = [
    ['>>>=', 'LOGICAL_SHIFTR_EQUAL'],
    ['>>>', 'LOGICAL_RSHIFT'],
    ['...', 'ELLIPSES'],
    ['||=', 'CONDITIONAL_EQUALS'],
    ['<<=', 'SHIFTL_EQUALS'],
    ['>>=', 'SHIFTR_EQUALS'],
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
    ['(', 'OPEN_PAREN'],
    [')', 'CLOSE_PAREN'],
    ['[', 'OPEN_BRACKET'],
    [']', 'CLOSE_BRACKET'],
    ['{', 'OPEN_BRACE'],
    ['}', 'CLOSE_BRACE'],
    ['.', 'DOT'],
    ['+', 'PLUS'],
    ['-', 'MINUS'],
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
    ['\n', 'NEWLINE', true]
  ];

  var advanced = [

    // NUMERIC_LITERAL
    [
      regexes.NUMERIC_LITERAL,
      function(matches, string) {
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
          token: {
            type: 'NUMERIC_LITERAL',
            value: number
          },

          position: matches[0].length
        };
      }
    ],

    // IDENTIFIER
    [
      regexes.IDENTIFIER,
      function(matches, string) {
        var token = {
          type: 'IDENTIFIER',
          value: matches[0]
        };

        return {
          token: token,
          position: matches[0].length
        };
      }
    ],

    // STRING_LITERAL
    [
      regexes.STRING_LITERAL,
      function(matches, string) {
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
          token: {
            type: 'STRING_LITERAL',
            value: string.substring(0, endQuotePos + 1)
          },

          position: endQuotePos + 1
        };
      }
    ],

    // SINGLE_LINE_COMMENT, MULTI_LINE_COMMENT, and SLASH
    [
      regexes.COMMENT_OR_SLASH,
      function(matches, string) {

        /**
         *  Finds the end of a multi-line comment, but takes balancing into account.
         *  Where traditional multi-line comments are terminated by a single
         *  star-slash terminator, Yapl comments can be nested within themselves,
         *  and to be closed must be balenced.
         */
        function findMultiCommentEnd(string, position) {
          for (var i = position + 2, len = string.length; i < len; ++i) {
            if (string[i] === '/' && string[i + 1] === '*') {
              i = findMultiCommentEnd(string, i);
            }

            if (string[i] === '*' && string[i + 1] === '/') {
              return i + 2;
            }
          }
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
              token: {
                type: 'SINGLE_LINE_COMMENT',
                value: comment
              },

              position: comment.length
            };
          
          // Multi-line comment
          case '*':
            // If it wasn't a balanced comment, the whole document from that point
            // on is commented out.
            var commentEnd = findMultiCommentEnd(string, 0) || string.length;

            return {
              token: {
                type: 'MULTI_LINE_COMMENT',
                value: string.substring(0, commentEnd + 1)
              },

              position: commentEnd + 1
            };

          // It was a slash, nothing special
          default:
            return {
              token: {
                type: 'SLASH'
              },

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
          token: {
            type: 'WHITESPACE',
            ignore: true
          },
          position: matches[0].length
        };
      }
    ]
  ];

  /**
   *  Function that will take a string of matched source that was not in the lookup
   *  of token values to types and try to match it to one of the advanced tokens.
   */
  function identify(string) {
    for (var i = 0, len = advanced.length; i < len; ++i) {
      var re = new RegExp('^' + advanced[i][0]);
      var matches = string.match(re);

      if (matches) return advanced[i][1](matches, string);
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

  // We didn't want this to be part of the overall regex, so we add it after the regex has been
  // created.
  tokens.push(['<<EOF>>', '<<EOF>>']);
  var typeLookup = prepare(tokens, prepare(reserved));

  return {
    regex: compiledRe,
    types: typeLookup,
    identify: identify
  }
})(jQuery);
