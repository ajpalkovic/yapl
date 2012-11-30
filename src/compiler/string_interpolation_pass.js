!function($) {

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

    function stringLiteral(string) {
      var token = new Token({
        type: 'STRING_LITERAL',
        value: "'" + string + "'",
        line: line // Need to have this when the syntax aug. pass tries to figure out
                   // if this string spans multiple lines.
      });

      return $node('single_string_literal', [$token(token)]);
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

        if (before.length) interpolations.push(stringLiteral(before));

        interpolations.push(parseCode(code));

        endOfLastInterpolation = end + 1;
      }
    }

    // Only add the rest of the string if there are other interpolations.  This way,
    // we wont have to do an unecessary join on an array to build the new string when
    // the result is just the string itself.
    if (interpolations.length) {
      var rest = string.substring(endOfLastInterpolation);
      if (rest.length) interpolations.push(stringLiteral(rest));
    }

    return interpolations;
  }

  var StringInterpolationPass = klass(pass, pass.ScopedTransformer, {
    initialize: function StringInterpolationPass() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'double_string_literal': this.onDoubleStringLiteral
      });
    },

    onDoubleStringLiteral: function(stringLiteral, scope) {
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
        ])
      ], [
        'member',
        'memberPart'
      ]);
    }
  });
}(jQuery);
