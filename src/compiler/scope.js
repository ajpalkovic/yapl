!function($) {
  var Context = klass({
    initialize: function Context(declaration) {
      this.declaration = declaration;
      this.methods = {};
      this.instanceVariables = {};
      this.scope = new Scope();
    },

    isInContext: function(symbol) {
      return this.scope.hasSymbol(symbol);
    },

    lookup: function(symbol) {
      return this.scope.lookup(symbol);
    },

    declare: function(declaration) {
      var name = declaration.children('.name').text();

      if (declaration.is('method')) {
        this.declareMethod(name, declaration);
      } else {
        this.declareVariable(name, declaration);
      }
    },

    declareMethod: function(symbol, value) {
      this.methods[symbol] = value;
      this.scope.set(symbol, value);
    },

    declareVariable: function(symbol, value) {
      this.instanceVariables[symbol] = value;
      this.scope.set(symbol, value);
    }
  });

  var Scope = klass({
    initialize: function Scope(parentScope, classContext, context) {
      this.parentScope = parentScope;
      this.classContext = classContext;
      this.context = context;
      this.fields = parentScope ? $.extend({}, false, parentScope.fields) : {};
    },

    subscope: function(classContext, context) {
      return new Scope(this, classContext || this.classContext, context || this.context);
    },

    hasSymbol: function(symbol) {
      return !!this.fields[symbol];
    },

    set: function(symbol, value) {
      this.fields[symbol] = value;
    },

    lookup: function(symbol) {
      return this.fields[symbol];
    },

    update: function(symbol, value) {
      this.lookup(symbol);
      this.fields[symbol] = value;
    }
  });
}(jQuery);