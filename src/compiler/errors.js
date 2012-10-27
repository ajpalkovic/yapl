!function($) {
  error = {};

  var CompileError = klass(error, {}, {
    initialize: function Error(line, message) {
      this.line = line;
      this.message = message;
    },

    toString: function() {
      return this.constructor.name + '(' + this.line + '): ' + this.message;
    }
  });

  var ReferenceError = klass(error, CompileError, {
    initialize: function ReferenceError(line, reference) {
      CompileError.prototype.initialize.call(this, line, reference + ' is not defined');
    }
  });
}(jQuery);