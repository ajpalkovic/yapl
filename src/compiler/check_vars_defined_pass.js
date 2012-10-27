!function($) {
  var CheckVarsDefinedPass = klass(pass, pass.ScopedTransformer, {
    initialize: function CheckVarsDefinedPass() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'identifier_reference': this.onIdentifier
      });
    },

    onIdentifier: function(identifierReference, scope) {
      var token = identifierReference.children('token');
      var name = token.text();

      if (!scope.hasSymbol(name)) {
        var line = token.attr('line');

        throw new error.ReferenceError(line, name);
      }
    }
  });
}(jQuery);