!function($) {
  var PROTOTYPE_TOKEN = $token(Token.identify('prototype').token);
  var SURROGATE_CTOR_TOKEN = $token(Token.identify('__surrogate_ctor').token);

  function classPrototype(className) {
    return $node('property_access', [
      className,
      PROTOTYPE_TOKEN
    ], [
      'member',
      'memberPart'
    ]);
  }

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
      classPrototype(className),
      method.children('.name')
    ], [
      'member',
      'memberPart'
    ]);

    return $statement($assignment(propertyAccess, methodToFunction(method, true)));
  }

  function createStaticFunction(method, className) {
    var propertyAccess = $node('property_access', [
      className,
      method.children('.name')
    ], [
      'member',
      'memberPart'
    ]);

    return $statement($assignment(propertyAccess, methodToFunction(method, true)));
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

    return $statement($assignment(propertyAccess, value));
  }

  var ClassDeclarationTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ClassDeclarationTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'class_declaration': this.onClassDeclaration
      });
    },

    onClassDeclaration: function(classDeclaration, scope) {
      var parentClass = classDeclaration.children('.parentClass');
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

      // Make the constructor function, but rename it to the class name
      // so the created objects will have the right name.
      var constructorMethod = classBody.children('.constructor').remove();
      constructorMethod = $node('method', [
        classNameToken,
        constructorMethod.children('.parameters'),
        constructorMethod.children('.body')
      ], [
        'name',
        'parameters',
        'body'
      ]);

      var constructorFn = methodToFunction(constructorMethod);

      wrapperBody.append(constructorFn);

      // If we have a parent class, we need to set up the prototype.
      if (parentClass.size()) {
        var surrogateCtor = $node('function_declaration', [
          SURROGATE_CTOR_TOKEN,
          $node('parameter_list'),
          $node('function_body')
        ], [
          'name',
          'parameters',
          'body'
        ]);

        wrapperBody.append(surrogateCtor);

        var surrogatePrototype = $node('property_access', [
          SURROGATE_CTOR_TOKEN,
          PROTOTYPE_TOKEN
        ], [
          'member',
          'memberPart'
        ]);

        var prototypeAssignment = $statement($assignment(surrogatePrototype, classPrototype(parentClass)));
        wrapperBody.append(prototypeAssignment);

        var newSurrogate = $node('new_expression', [SURROGATE_CTOR_TOKEN]);

        var inheritanceAssignment = $statement($assignment(classPrototype(classNameToken), newSurrogate));
        wrapperBody.append(inheritanceAssignment);
      }

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

      var returnStatement = $statement($node('keyword_statement', [
        $token(Token.RETURN),
        constructorFn.children('.name')
      ], [
        'keyword',
        'expression'
      ]));

      wrapperBody.append(returnStatement);

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
