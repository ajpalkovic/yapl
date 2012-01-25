var Program = (function($) {
  var template = compiler.compileTemplate(function(sourceElements) {
    '#{sourceElements}';
  });

  return Class.create({
    initialize: function Program(sourceElements) {
      this.sourceElements = sourceElements || [];
    },

    genJs: function(buffer) {

    }
  });
})(jQuery);
