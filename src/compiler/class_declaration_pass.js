!function($) {
  var ClassDeclarationTransformer = klass(pass, pass.Transformer, {
    initialize: function ClassDeclarationTransformer() {
      pass.Transformer.prototype.initialize.call(this, {
        'class_declaration': this.onClassDeclaration
      });
    },

    onClassDeclaration: function(classDeclaration, data) {
      var wrapper = $node('closure');
      var wrapperBody = wrapper.children('.body');
      var classNameToken = classDeclaration.children('.name');
      var constructorFn = this.extractConstructor(classDeclaration);

      wrapper.append(constructorFn);

      var assignment = $variable(classNameToken, wrapper);
      return assignment;
    }
  });
}(jQuery);
