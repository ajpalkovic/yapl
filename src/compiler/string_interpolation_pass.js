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

    function parseCode(code, lineOffset) {
      var tree = parser.parse(code, lineOffset);
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
    var lineOffset = line;

    for (var i = 0; i < string.length; ++i) {
      switch (string[i]) {
        case '\\':
          lineOffset += (string[i + 1] === 'n');
          ++i;
          break;

        case '#':
          if (string[i + 1] === '{') {
            var end = balanceInterpolation(i + 1);

            var before = string.substring(endOfLastInterpolation, i);
            var code = string.substring(i + 2, end);

            if (before.length) interpolations.push(makeStringLiteral(before, lineOffset));

            interpolations.push(parseCode(code, lineOffset));

            endOfLastInterpolation = end + 1;
          }
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

      var newLines = lines.map(function(line, i) {
        var lineNumber = startingLineNumber + i;

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
          var indentationToken = new Token({type: 'WHITESPACE', value: '', line: lineNumber});
        }

        var indentation = indentationToken.value;

        if (indentation.length < initialIndentation.length) {
          // TODO: throw an error, the indentation was off.
          throw new error.IncorrectIndentation(lineNumber);
        }

        return line.substring(initialIndentation.length);
      });

      var newStringToken = Token.identify("'" + newLines.join('\\n') + "'").token;
      newStringToken.line = startingLineNumber;

      return $node('single_string_literal', [$token(newStringToken)]);
    },

    onDoubleStringLiteral: function(stringLiteral, scope, compiler) {
      // We make sure we indent properly before interpolating the string.
      stringLiteral = this.onStringLiteral(stringLiteral, scope, compiler);

      var string = stringLiteral.children('token').text();
      var line = parseInt(stringLiteral.children('token').attr('line'));
      var interpolations = interpolate(string, line, scope);

      if (!interpolations.length) return;

      var concatenation = makeStringLiteral('', line);
      var seenStringLiteral = false;

      interpolations.slice(0).each(function(interpolation, i) {
        // Disregarding the empty string we added to the front of the interpolations,
        // we want to see if there were any strings in the interpolation, because if there
        // aren't we want to make sure we keep the blank string so everything is
        // coerced into a string
        seenStringLiteral = seenStringLiteral || (interpolation.is('single_string_literal') && i > 0);

        concatenation = $node('additive_expression', [
          concatenation,
          $node('operator', [$token(new Token({type: 'PLUS', value: '+'}))]),
          interpolation
        ], [
          'left',
          'operator',
          'right'
        ]);
      });

      return concatenation;
    }
  });
}(jQuery);
