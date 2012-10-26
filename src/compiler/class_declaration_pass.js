!function($) {
  var ClassDeclarationAdapter = klass(pass, pass.Adapter, {
    initialize: function ClassDeclarationAdapter() {
      pass.Adapter.prototype.initialize.call(this);
    },

    onClassDeclaration: function(classDeclaration, data) {

    }
  });

  var ClassDeclarationTransformer = klass(pass, pass.Transformer, {
    initialize: function ClassDeclarationTransformer() {
      pass.Transformer.prototype.initialize.call(this, new ClassDeclarationAdapter());
    }
  });
}(jQuery);