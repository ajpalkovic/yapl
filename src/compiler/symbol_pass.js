!function($) {
  var SymbolAdapter = klass(pass, pass.Adapter, {
    initialize: function() {
      pass.Adapter.prototype.initialize.call(this);
    },

    onClassDeclaration: function(classDeclaration) {

    }
  });

  var SymbolPass = klass(pass, pass.Pass, {
    initialize: function() {
      pass.Pass.prototype.initialize.call(this, new SymbolAdapter());
    },

    handleChild: function(parent, child, index, data) {

    }
  });
}(jQuery);