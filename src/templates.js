!function() {
  function declaration(varName, value) {
    return new TerminatedStatement(
        new VariableStatement([new VariableDeclaration(varName, value)]));
  }

  function emptyObject(varName) {
    return declaration(varName, new ObjectLiteral());
  }

  var varNames = {
    classProto: '__proto__',
    method: '__method__',
    super: '__super__',
    klass: '__klass__',
    ctor: '__ctor__'
  };

  window.Templates = {
    varNames: varNames
  };

  window.Templates.templateFns = {
    ClassDeclaration: [
      function(name, body) {
        [
          'var ' 
        ];
      },

      function(name, parentClass, body) {
        [
          '!function() {',

            // Setup the inheritance.
            'function #{name}() {',
              'this.#{name}.apply(this, arguments);',
            '};',

            'function #{varNames.klass}() {};',
            '#{varNames.klass}.prototype = #{parentClass}.prototype;',
            '#{name}.prototype = new #{varNames.klass};',

            'var #{varNames.classProto} = #{name}.prototype;',

            '#{body}',

            'if (!#{name}.prototype.#{name}) #{name}.prototype.#{name} = function() {};',
            '#{$parentScope}.#{name} = #{name};'
          '}();'
        ];
      }
    ]
  };
}();
