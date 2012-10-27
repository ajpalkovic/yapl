!function($) {
  var ClassDeclarationPass = klass(pass, pass.Pass, {
    initialize: function ClassDeclarationPass() {
      pass.Pass.prototype.initialize.call(this, {
        'class_declaration': this.onClassDeclaration
      });
    },

    onClassDeclaration: function(classDeclaration, data) {
      var className = classDeclaration.children('.name').text();
      var constructorMethod = classDeclaration.children('.body').children('method').filter(function(i) {
        if ($(this).children('.name').text() === className) return true;
      });

      if (!constructorMethod.size()) {
        var parameters = $node('node_list');
        var body = $node('function_body');

        constructorMethod = $node('method',
          [classDeclaration.children('.name'), parameters, body],
          ['name', 'parameters', 'body']);
      }

      constructorMethod.attr('class', 'constructor');
      classDeclaration.append(constructorMethod);
    }
  });
}(jQuery);