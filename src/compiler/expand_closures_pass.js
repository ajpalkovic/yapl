!function($) {
  var ExpandClosuresTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ExpandClosuresTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'closure': this.onClosure
      });
    },

    onClosure: function(closure, scope, compiler) {
      var parameters = closure.children('.parameters');
      var body = closure.children('.body');

      var callArguments = $node('argument_list');
      var newParameters = $node('parameter_list');

      parameters.children().each(function(i) {
        var parameter = $(this).clone();

        var nameToken = parameter.children('.name');
        var name = nameToken.text();

        var valueToken = parameter.children('.value');
        var value = valueToken.text();

        var referencedNameToken = value ? valueToken : nameToken;
        var referencedName = referencedNameToken.text();

        // The closure construct does not allow parameter names that don't already shadow
        // the same symbol in some parent scope.
        if (!scope.hasSymbol(referencedName)) {
          throw new error.ReferenceError(referencedNameToken.attr('line'), referencedName);
        }

        var newParameter = $node('variable_declaration', [nameToken], ['name']);

        newParameters.append(newParameter);
        callArguments.append(value ? valueToken : nameToken.clone());
      });

      var nestedExpression = $node('nested_expression');
      nestedExpression.attr('class', closure.attr('class'));

      var anonymousFn = $node('function_expression',
        [null, newParameters, body],
        ['name', 'parameters', 'body']);


      // We have to force the recursion on the newly created function, because the pass will not be run
      // again over the newly created function expression
      this.runWithScopeNode(anonymousFn, scope, compiler);

      nestedExpression.append(anonymousFn);

      var call = $node('call',
        [nestedExpression, callArguments],
        ['member', 'memberPart']);

      return call;
    }
  });
}(jQuery);