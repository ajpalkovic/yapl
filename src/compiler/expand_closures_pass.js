!function($) {
  var ExpandClosuresTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ExpandClosuresTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'closure': this.onClosure
      });
    },

    onClosure: function(closure, scope) {
      var parameters = closure.children('.parameters');
      var body = closure.children('.body');

      var callArguments = $node('argument_list');
      var newParameters = $node('parameter_list');

      parameters.children().each(function(i) {
        var parameter = $(this).clone();

        if (parameter.is('basic_parameter')) {
          var nameToken = parameter.children('token');
          var name = nameToken.text();

          // The closure construct does not allow parameter names that don't already shadow
          // the same symbol in some parent scope.
          if (!scope.hasSymbol(name)) {
            throw new error.ReferenceError(nameToken.attr('line'), name);
          }

          newParameters.append(parameter);
          callArguments.append(parameter.clone());
        } else if (parameter.is('default_argument')) {
          newParameters.append(parameter.children('.name'));
          callArguments.append(parameter.children('.value'));
        }
      });

      var nestedExpression = $node('nested_expression');
      nestedExpression.attr('class', closure.attr('class'));

      var anonymousFn = $node('function_expression',
        [null, newParameters, body],
        ['name', 'parameters', 'body']);

      nestedExpression.append(anonymousFn);

      var call = $node('call',
        [nestedExpression, callArguments],
        ['member', 'memberPart']);

      return call;
    }
  });
}(jQuery);