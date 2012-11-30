!function($) {
  var SpecialParametersTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function SpecialParametersTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'parameter_list': this.onParameters
      });
    },

    onParameters: function(parameters, scope) {
      var callable = parameters.parent();
      var callableName = callable.children('.name');
      var body = callable.children('.body');

      var paramPrologue = $node('param_prologue');

      function parameterHandler(transformFn) {
        return function(i) {
          var parameter = $(this);
          var nextParam = parameter.next();

          // We need to get the actual declaration out of the auto-set.
          if (parameter.is('auto_set_param')) {
            parameter = parameter.children('variable_declaration');
          }

          var paramName = parameter.children('.name');
          var value = parameter.children('.value');

          transformFn(paramName, value, nextParam);
          parameter.replaceWith(paramName);
        }
      }

      parameters.children().each(parameterHandler(function(paramName, value, nextParam) {
        if (!value.size()) return;

        if (nextParam.size() && !nextParam.find('.value').size()) {
          throw new error.InvalidDefaultArgumentConfiguration(callableName.attr('line'), callableName.text());
        }

        var assignment = $statement(
          $assignment(
            paramName,
            $node('simple_expression', [
              paramName,
              $node('operator', [Token.LOGICAL_OR]),
              value
            ], [
              'left',
              'operator',
              'right'
            ])
          )
        );

        paramPrologue.append(assignment);
      }));

      body.prepend(paramPrologue.children());
    }
  });
}(jQuery);