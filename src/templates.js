var Templates = (function({
  function makeVar(varName, value) {
    return new TerminatedStatement(
        new VariableStatement([new VariableDeclaration(varName, value)]));
  }

  return {
    ClassDeclaration: [
      [
        '(function () {',
        '  var __methods__ = {};',
        '  #{body}',
        '  return function() {',
        '    ',
        '  };',
        '  return #{body.constructor.name};',
        '})();'
      ],

      [
        '(function () {',
        '  var __methods__ = {}',
        '  #{makeVar("__super__", #{parent})}',
        '  #{body}',
        '})();'
      ]
    ],
  };
})();  