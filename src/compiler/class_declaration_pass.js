!function($) {
  var PROTOTYPE_TOKEN = $token(Token.identify('prototype').token);

  function methodToFunction(method, anonymous) {
    return !anonymous ? $node('function_declaration', [
      method.children('.name'),
      method.children('.parameters'),
      method.children('.body')
    ], [
      'name',
      'parameters',
      'body'
    ]) : $node('function_expression', [
      method.children('.parameters'),
      method.children('.body')
    ], [
      'parameters',
      'body'
    ]);
  }

  function createFunctionOnPrototype(method, className) {
    var propertyAccess = $node('property_access', [
      $node('property_access', [
        className,
        PROTOTYPE_TOKEN
      ], [
        'member',
        'memberPart'
      ]),

      method.children('.name')
    ], [
      'member',
      'memberPart'
    ]);

    return $assignment(propertyAccess, methodToFunction(method, true));
  }

  function createStaticFunction(method, className) {
    var propertyAccess = $node('property_access', [
      className,
      method.children('.name')
    ], [
      'member',
      'memberPart'
    ]);

    return $assignment(propertyAccess, methodToFunction(method, true));
  }

  function createStaticVariable(variable, className) {
    var propertyAccess = $node('property_access', [
      className,
      variable.children('.name')
    ], [
      'member',
      'memberPart'
    ]);

    var value = variable.children('.value').size() ?
      variable.children('.value') : $token(Token.identify('undefined').token);

    return $assignment(propertyAccess, value);
  }

  var ClassDeclarationTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ClassDeclarationTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'class_declaration': this.onClassDeclaration
      });
    },

    onClassDeclaration: function(classDeclaration, scope) {
      var classBody = classDeclaration.children('.body');
      var wrapper = $node('function_expression', [
        $node('parameter_list'),
        $node('function_body')
      ], [
        'parameters',
        'body'
      ]);

      var wrapperBody = wrapper.children('.body');
      var classNameToken = classDeclaration.children('.name');

      // Handle nested classes
      var _this = this;
      classBody.children('class_declaration').each(function(i) {
        wrapperBody.append(_this.onClassDeclaration($(this), scope));
      });

      // Make the constructor function
      var constructorFn = methodToFunction(classBody.children('.constructor').remove());
      wrapperBody.append(constructorFn);

      // Handle the static variables
      classBody.children('static_var_declaration_statement').find('variable_declaration').each(function(i) {
        wrapperBody.append(createStaticVariable($(this), classNameToken));
      });

      // Handle the static methods
      classBody.children('static_method').children('method').each(function(i) {
        wrapperBody.append(createStaticFunction($(this), classNameToken));
      });

      // Handle the methods
      classBody.children('method').each(function(i) {
        wrapperBody.append(createFunctionOnPrototype($(this), classNameToken));
      });

      // We can't use the closure node here because they are handled in an
      // earlier stage in compilation.
      var call = $node('call', [
        $node('nested_expression', [wrapper]),
        $node('parameter_list')
      ], [
        'member',
        'memberPart'
      ]);

      return $variable(classNameToken, call);
    }
  });
}(jQuery);
