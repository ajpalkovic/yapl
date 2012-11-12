!function($) {
  var ClassDeclarationTransformer = klass(pass, pass.Transformer, {
    initialize: function ClassDeclarationTransformer() {
      pass.Transformer.prototype.initialize.call(this, {
        'class_declaration': this.onClassDeclaration
      });
    },

    onClassDeclaration: function(classDeclaration, data) {
      var wrapper = $node('closure');
      var classNameToken = classDeclaration.children('.name');
      var constructorFn = this.extractConstructor(classDeclaration);

      wrapper.append(constructorFn);

      var assignment = $variable(classNameToken, wrapper);
      return assignment;
    },

    extractConstructor: function(classDeclaration) {
      var classNameToken = classDeclaration.children('.name');
      var className = classNameToken.text();

      var constructorMethod = classDeclaration.children('.body').children('method').filter(function(i) {
        if ($(this).children('.name').text() === className) return true;
      });

      if (!constructorMethod.size()) {
        var parameters = $node('node_list');
        var body = $node('function_body');

        constructorMethod = $node('method',
          [classNameToken, parameters, body],
          ['name', 'parameters', 'body']);
      }

      var constructorFn = $node('function_declaration',
        [classNameToken, constructorMethod.children('.parameters'), constructorMethod.children('.body')],
        ['name', 'parameters', 'body']);

      return constructorFn;
    }
  });
}(jQuery);
