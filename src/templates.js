var Templates = (function({
  function declaration(varName, value) {
    return new TerminatedStatement(
        new VariableStatement([new VariableDeclaration(varName, value)]));
  }

  function emptyObject(varName) {
    return declaration(varName, new ObjectLiteral());
  }

  var IDENTIFIER = {
    METHODS: '__methods__',
    SUPER: '__super__'
  };

  return {
    ClassDeclaration: [
      function(body) {
        [
          'var ' 
        ];
      },

      function(body, parentClass) {
        [
          '(function () {',
          '  var __methods__ = {}',
          '  #{assignment(IDENTIFIER.SUPER, parent)}',
          '  #{body}',
          '})();'
        ];
      }
    ]
  };
})();
