!function($) {
  var ClassBodyTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ClassBodyTransformer() {
      // We use the child operator (>) because we don't want these methods
      // to match nested classes.
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'class_declaration > class_body > method > function_body identifier_reference': this.onIdentifier,
        'class_declaration > class_body > static_method': this.onStaticMethod,
        'class_declaration > class_body > static_method > method > function_body identifier_reference': this.onIdentifierInStaticMethod
      });
    },

    onIdentifier: function(identifierReference, scope) {
      var nameToken = identifierReference.children('token');
      var name = nameToken.text();

      // We assume we know this symbol was defined from the first stage.
      var declaration = scope.lookup(name);

      if (declaration.is('method, instance_var_declaration')
        || (declaration.is('variable_declaration') && declaration.parents('instance_var_declaration').size())) {

        return $node('property_access',
          [$token(Token.THIS), nameToken],
          ['member', 'memberPart']
        );
      }
    },

    onStaticMethod: function(staticMethod, scope) {
      console.log('yes');
    },

    onIdentifierInStaticMethod: function(identifierReference, scope) {
      var nameToken = identifierReference.children('token');
      var name = nameToken.text();
      var declaration = scope.lookup(name);

      if (declaration.is('instance_var_declaration variable_declaration')) {
        throw new error.NonStaticReference(nameToken.attr('line'), name);
      }
    }
  });
}(jQuery);
