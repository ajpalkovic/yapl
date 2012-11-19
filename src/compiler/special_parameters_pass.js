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

          var paramName = parameter.find('.name');
          var value = parameter.find('.value');

          transformFn(paramName, value, nextParam);
        }
      }

      parameters.children().each(parameterHandler(function(paramName, value, nextParam) {
        if (!value.size()) return;

        if (nextParam.size() && !nextParam.find('.value').size()) {
          throw new error.InvalidDefaultArgumentConfiguration(callableName.attr('line'), callableName.text());
        }

        console.log(paramName);

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

      body.append(paramPrologue.children());
    }
  });
}(jQuery);