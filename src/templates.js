var Templates = (function() {
  function declaration(varName, value) {
    return new TerminatedStatement(
        new VariableStatement([new VariableDeclaration(varName, value)]));
  }

  function emptyObject(varName) {
    return declaration(varName, new ObjectLiteral());
  }

  var id = {
    classProto: '__proto__',
    method: '__method__',
    super: '__super__',
    klass: '__klass__',
    ctor: '__ctor__'
  };

  return {
    ClassDeclaration: [
      function(name, body) {
        [
          'var ' 
        ];
      },

      function(name, parentClass, body) {
        [
          'var #{name} = -function() {',

            // Setup the inheritance.
            'function #{name}() {',
              'this.#{name}.apply(this, arguments);',
            '};',

            'function #{id.klass}() {};',
            '#{id.klass}.prototype = #{parentClass}.prototype;',
            '#{name}.prototype = new #{id.klass};',

            'var #{id.classProto} = #{name}.prototype;',

            '#{body}',

            'if (!#{name}.prototype.#{name}) #{name}.prototype.#{name} = function() {};',
            'return #{name};',
          '}();'
        ];
      }
    ]
  };
})();
