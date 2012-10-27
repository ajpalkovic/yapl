!function($) {
  var Scope = klass({
    initialize: function Scope(parentScope) {
      this.parentScope = parentScope;
      this.fields = parentScope ? $.extend({}, false, parentScope.fields) : {};
    },

    subscope: function() {
      return new Scope(this);
    },

    hasSymbol: function(symbol) {
      return !!this.fields[symbol];
    },

    set: function(symbol, value) {
      this.fields[symbol] = value;
    },

    lookup: function(symbol) {
      if (!this.hasSymbol(symbol)) throw new errors.ReferenceError(symbol);

      return this.fields[symbol];
    },

    update: function(symbol, value) {
      this.lookup(symbol);
      this.fields[symbol] = value;
    }
  });
}(jQuery);