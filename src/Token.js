var Token = (function() {
  var IDENTIFIER = '(?=[^a-zA-Z_0-9])';

  function compileRegex(tokens, escape) {
    var regex = [];

    for (var i = 0, len = tokens.length; i < len; ++i) {
      var regexString = escape ? tokens[i][0].replace(/(\\|\^|\$|\{|\}|\[|\]|\(|\)|\.|\*|\+|\?|\|)/g, '\\$1') : tokens[i][0];
      regex.push('(?:' + regexString + ')');
    }

    var tokenRegex = regex.join('|');
    return '(?:' + tokenRegex + ')';
  }

  function prepare(tokens, lookup) {
    var lookup = lookup || {};

    for (var i = 0, len = tokens.length; i < len; ++i) {
      (function(value) {
        lookup[value[0]] = (typeof value[1] === 'function') ? value[1] : function() {
          return {
            token: {
              value: value[0],
              type: value[1]
            }
          };
        };
      })(tokens[i]);
    }

    return lookup;
  }

  var reserved = [
    ['function', 'FUNCTION'],
    ['var', 'VAR'],
    ['if', 'IF'],
    ['instanceof', 'INSTANCEOF'],
    ['in', 'IN'],
    ['else', 'ELSE'],
    ['elseif', 'ELSEIF'],
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
    ['/', 'SLASH'],
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
    ['\n', 'NEWLINE']
  ];

  var advanced = [

    // NUMERIC_LITERAL
    [
      '[+-]?(?:((?:0[0-7]+))|((?:0x[a-fA-F0-9]+))|((?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE]\\d+)?))',
      function(matches, string) {
        matches = matches.slice(1);
        var number = $.map(matches, function(value, index) { 
          if (value) return [value, 8 + (index * 2)]; 
        })[0];

        var token = {
          type: 'INTEGER',
          value: parseInt(number[0], number[1])
        };

        return {
          token: token,
          position: matches[0].length
        };
      }
    ],

    // IDENTIFIER
    [
      '[a-zA-Z_\\$][-_a-zA-Z0-9\\$]*',
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
      '(\'|")',
      function(matches, string) {
        var quote = matches[1];
        var endQuotePos = 0;

        for (var i = matches[0].length, len = string.length; i < len; ++i) {
          if (string[i] === quote) {
            endQuotePos = i;
            break;
          } else if (string[i] === '\\') {
            i++;
          }
        }

        if (!endQuotePos) return undefined;

        var stringLiteral = string.substring(0, endQuotePos + 1);
        var octal = /\\(([0-6]{1, 3}))/g;
        var hex = /\\x([a-f0-9]{2})/gi;
        var unicode = /\\u([a-f0-9]{4})/gi;


        stringLiteral = stringLiteral.gsub(octal, function(matches) {
                                       return String.fromCharCode(parseInt(matches[1], 7));
                                     })
                                     .gsub(hex, function(matches) {
                                       return String.fromCharCode(parseInt(matches[1], 16));
                                     })
                                     .gsub(unicode, function(matches) {
                                       return String.fromCharCode(parseInt(matches[1], 16));
                                     });

        return {
          token: {
            type: 'STRING_LITERAL',
            value: stringLiteral
          },

          position: endQuotePos + 1
        };
      }
    ],
    
    // REGEX
    [
      '(\\/(?:[^\\/]|\\/)*\\/)',
      function(matches, string) {
        var token = {
          type: 'REGULAR_EXPRESSION',
          value: matches[0].replace(/\s+/, '')
        };

        return {
          token: token,
          position: matches[0].length
        }
      }
    ],

    // WHITESPACE
    [
      '((?:[^\\S\\n]+))', 
      function(matches, string) {
        return {
          token: {
            type: 'WHITESPACE',
            value: matches[0]
          },

          position: matches[0].length
        };
      }
    ]
  ];

  function identify(string) {
    for (var i = 0, len = advanced.length; i < len; ++i) {
      var re = new RegExp('^' + advanced[i][0]);
      var matches = string.match(re);

      if (matches) return advanced[i][1](matches, string);
    }

    return undefined;
  }

  var reservedRegex = compileRegex(reserved, true) + IDENTIFIER;
  var tokenRegex = compileRegex(tokens, true);

  var compiledRe = '^' + compileRegex([[reservedRegex], [tokenRegex]]);

  return {
    regex: compiledRe,
    types: prepare(tokens, prepare(reserved)),
    identify: identify
  }
})();
