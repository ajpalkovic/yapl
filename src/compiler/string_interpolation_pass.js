!function($) {
  function makeStringLiteral(string, line) {
    var token = new Token({
      type: 'STRING_LITERAL',
      value: "'" + string + "'",
      line: line // Need to have this when the syntax aug. pass tries to figure out
                 // if this string spans multiple lines.
    });

    return $node('single_string_literal', [$token(token)]);
  }

  function interpolate(string, line, scope) {
    // Remove the quotes.
    string = string.substring(1, string.length - 1);

    var parser = new InterpolationParser();

    function balanceInterpolation(index) {
      for (var i = index; i < string.length; ++i) {
        switch (string[i]) {
          case '{':
            var end = balanceInterpolation(i + 1);
            i = end;
          case '}':
            return i;
        }
      }
    }

    function parseCode(code) {
      var tree = parser.parse(code, line);
      return $node('closure', [
        $node('parameter_list'),
        $node('function_body', [tree])
      ], [
        'parameters',
        'body'
      ]);
    }

    var interpolations = [];
    var endOfLastInterpolation = 0;

    for (var i = 0; i < string.length; ++i) {
      if (string[i] === '\\') {
        i++;
        continue;
      }

      if (string[i] === '#' && string[i + 1] === '{') {
        var end = balanceInterpolation(i + 1);

        var before = string.substring(endOfLastInterpolation, i);
        var code = string.substring(i + 2, end);

        if (before.length) interpolations.push(makeStringLiteral(before, line));

        interpolations.push(parseCode(code));

        endOfLastInterpolation = end + 1;
      }
    }

    // Only add the rest of the string if there are other interpolations.  This way,
    // we wont have to do an unecessary join on an array to build the new string when
    // the result is just the string itself.
    if (interpolations.length) {
      var rest = string.substring(endOfLastInterpolation);
      if (rest.length) interpolations.push(makeStringLiteral(rest, line));
    }

    return interpolations;
  }

  var StringInterpolationPass = klass(pass, pass.ScopedTransformer, {
    initialize: function StringInterpolationPass() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'double_string_literal': this.onDoubleStringLiteral,
        'single_string_literal': this.onStringLiteral
      });
    },

    onStringLiteral: function(stringLiteral, scope, compiler) {
      var stringText = stringLiteral.children('token').text();
      // Remove the quotes.
      stringText = stringText.substring(1, stringText.length - 1);

      var startingLineNumber = parseInt(stringLiteral.children('token').attr('line'));
      var lines = stringText.split('\n');

      var initialIndentation = compiler.parser.lexer.getIndent(startingLineNumber).value;

      var newLines = lines.slice(1).map(function(line, i) {
        try {
          var indentationToken = Token.identify(line).token;
        } catch (e) {
          // Whatever was at the beginning of the line in the string was not a proper
          // lexical token, but since we are in a string and not in the source code,
          // it doesn't matter, so we just say the indentation is empty.
          //
          // eg. x = '
          //     `
          //     '
          var indentationToken = new Token({type: 'WHITESPACE', value: ''});
        }

        var indentation = indentationToken.value;

        if (indentation.length < initialIndentation.length) {
          // TODO: throw an error, the indentation was off.
          throw new error.IncorrectIndentation(startingLineNumber + i);
        }

        return line.substring(initialIndentation.length);
      });

      if (lines[0].length) newLines.prepend(lines[0]);
      var newStringToken = Token.identify("'" + newLines.join('\\n') + "'").token;

      return $node('single_string_literal', [$token(newStringToken)]);
    },

    onDoubleStringLiteral: function(stringLiteral, scope, compiler) {
      // We make sure we indent properly before interpolating the string.
      stringLiteral = this.onStringLiteral(stringLiteral, scope, compiler);

      var string = stringLiteral.children('token').text();
      var line = stringLiteral.children('token').attr('line');
      var interpolations = interpolate(string, line, scope);

      if (!interpolations.length) return;

      var arrayElements = $node('array_element_list');
      interpolations.each(function(interpolation) {
        arrayElements.append(interpolation);
      });

      var arrayLiteral = $node('array_literal', [arrayElements], ['elements']);

      return $node('call', [
        $node('property_access', [
          arrayLiteral,
          $token(Token.identify('join').token)
        ], [
          'member',
          'memberPart'
        ]),

        $node('argument_list', [
          makeStringLiteral('', line)
        ])
      ], [
        'member',
        'memberPart'
      ]);
    }
  });
}(jQuery);
