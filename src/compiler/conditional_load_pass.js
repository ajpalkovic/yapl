!function($) {
  var ConditionalLoadTransformer = klass(pass, pass.Transformer, {
    initialize: function ConditionalLoadTransformer() {
      pass.Transformer.prototype.initialize.call(this, {
        'conditional_load': this.onConditionalLoad
      });
    },

    onConditionalLoad: function(conditionalLoad) {
      var nonConditionalLoad = undefined;
      var validPropertyAccess = undefined;

      // If we have more safe loads to do (chained conditional loads)
      if (conditionalLoad.children('conditional_load').size()) {
        // We recursively safe load the previous conditional load
        nonConditionalLoad = this.onConditionalLoad(conditionalLoad.children('conditional_load'));

        // And we know that the right hand side of the safe load is our
        // valid property access upon which we can tack another property load
        // without error.
        //
        //   nonConditionalLoad
        //     |--------|
        // eg. (a && a.b) && a.b.c
        //           |--|    |--|
        //         validPropertyAccess
        validPropertyAccess = nonConditionalLoad.children('.right');
      } else {
        // In the base case, where there are no more loads to recursively perform,
        // our non-conditional load and valid property access are one and the same.
        //
        //   nonConditionalLoad
        //     |
        // eg. a && a.b
        //          |
        //        validPropertyAccess
        nonConditionalLoad = validPropertyAccess = conditionalLoad.children('.member');
      }

      console.log(conditionalLoad.children('.memberPart'));

      // Now make a new valid property access with the old valid property access as the
      // property accesses upon which we tack our next property load.
      validPropertyAccess = $node('PropertyAccess',
        [validPropertyAccess, conditionalLoad.children('.memberPart')],
        ['member', 'memberPart']);

      // And we create a new 'check' that is evaluated at runtime and will short circuit if
      // the last property in nonConditional load does not exist.
      nonConditionalLoad = $node('SimpleExpression',
        [nonConditionalLoad, $token(Token.LOGICAL_AND), validPropertyAccess],
        ['left', 'operator', 'right']);

      return nonConditionalLoad;
    }
  });
}(jQuery);