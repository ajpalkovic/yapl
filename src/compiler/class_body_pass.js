!function($) {
  var PROTOTYPE_TOKEN = $token(Token.identify('prototype').token);
  var CONSTRUCTOR_NAME = 'initialize';

  function makeThisReference(nameToken) {
    return $node('property_access',
      [$token(Token.THIS), nameToken],
      ['member', 'memberPart']
    );
  }

  var ClassBodyTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function ClassBodyTransformer() {
      // We use the child operator (>) because we don't want these methods
      // to match nested classes.
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'class_declaration > .body': this.onClassBody,
        'class_declaration > .body > method > .body member_identifier': this.onMemberIdentifier,
        'class_declaration > .body > method super': this.onSuper,
        'class_declaration > .body identifier_reference': this.onIdentifier,
        'class_declaration > .body > static_method > method > .body identifier_reference': this.onIdentifier,
        'class_declaration > .body > method > .body identifier_reference': this.onIdentifier,
        'class_declaration > .body > accessor': this.onAccessor,
        'class_declaration > .body > instance_var_declaration_statement': this.onInstanceVarDeclarationStatement,
        'class_declaration > .body > method > .parameters auto_set_param': this.onAutoSetParam
      });
    },

    onClassBody: function(classBody, scope) {
      var constructorMethod = scope.classContext.methods[CONSTRUCTOR_NAME];

      if (!constructorMethod) {
        constructorMethod = $node('method', [
          $token(Token.identify(CONSTRUCTOR_NAME).token),
          $node('parameter_list'),
          $node('function_body')
        ], [
          'name',
          'parameters',
          'body'
        ]);

        scope.classContext.declare(constructorMethod);
        classBody.append(constructorMethod);
      }

      constructorMethod.addClass('constructor');
    },

    onMemberIdentifier: function(memberIdentifier, scope) {
      var nameToken = memberIdentifier.children('token');

      return makeThisReference(nameToken);
    },

    onSuper: function(superCall, scope) {
      var className = scope.context.declaration.children('.name').text();
      var parentClass = scope.context.declaration.children('.parentClass');

      if (!parentClass.size()) {
        throw new error.NoSuperClassError(superCall.children('token').attr('line'), className);
      }

      var methodName = superCall.closest('method').children('.name');
      var parameters = superCall.parent().is('call') ?
        superCall.parent().children('.memberPart').children() : $node('parameter_list');

      parameters.prepend($token(Token.THIS));

      // TODO: figure out how super should work. We don't really have access to the
      // instance of the super class in JS.
    },

    onIdentifier: function(identifierReference, scope) {
      var name = identifierReference.children('token').text();

      // Handle static variables. We need to any parent contexts too, in case a nested
      // class is using a static variable of a parent class.
      while (scope && scope.classContext) {
        if (scope.classContext.isInContext(name)) {
          var declaration = scope.classContext.lookup(name);

          if (declaration.is('static_method, static_var_declaration_statement > variable_statement variable_declaration')) {
            return $node('property_access', [
              scope.classContext.declaration.children('.name'),
              declaration.children('.name')
            ], [
              'member',
              'memberPart'
            ]);
          } else if (declaration.is('method')) {
            return makeThisReference(declaration.children('.name'));
          }
        }

        scope = scope.parentScope;
      }
    },

    onInstanceVarDeclarationStatement: function(instanceVarDeclarationStatement, scope) {
      var instanceVarDeclaration = instanceVarDeclarationStatement.find('instance_var_declaration');

      var nameToken = instanceVarDeclaration.children('.name');
      var value = instanceVarDeclaration.children('.value');
      value = value.size() ? value : $token(Token.UNDEFINED);

      var name = nameToken.text();
      var constructorMethod = scope.classContext.methods[CONSTRUCTOR_NAME];
      var doDeclaration = true;

      constructorMethod.children('.parameters').children().each(function(i) {
        var parameter = $(this);

        if (parameter.is('auto_set_param')) {
          var parameterName = parameter.children('variable_declaration').children('.name').text();

          // We don't want to double declare/assign an instance variable if it
          // will be auto-assigned in the constructor anyway.
          if (name === parameterName) {
            doDeclaration = false;
            return;
          }
        }
      });

      if (doDeclaration) {
        var memberAssign = $statement($assignment(
          $node('member_identifier', [nameToken], ['name']),
          value
        ));

        constructorMethod.children('.body').prepend(memberAssign);
      }

      return null;
    },

    onAutoSetParam: function(autoSetParam, scope) {
      var body = autoSetParam.closest('method').children('.body');
      var nameToken = autoSetParam.children('variable_declaration').children('.name');
      var value = autoSetParam.children('variable_declaration').children('.value');
      var name = nameToken.text();

      if (!scope.classContext.instanceVariables[name]) {
        throw new error.NoMemberToSet(nameToken.attr('line'), name);
      }

      value = value.size() ? $node('simple_expression', [
        nameToken,
        Token.LOGICAL_OR,
        value
      ], [
        'left',
        'operator',
        'right'
      ]) : nameToken;

      var setStatement = $statement($assignment(makeThisReference(nameToken), value));
      body.prepend(setStatement);

      // Needs to be a variable declaration to be consistent
      return $node('variable_declaration', [
        nameToken
      ], [
        'name'
      ]);
    },

    onAccessor: function(accessor, scope) {
      var classBody = accessor.parent();
      var type = accessor.children('.type').text();
      var variables = accessor.children('.variables').children();
      var typeMap = {
        'gets': makeGetter,
        'sets': makeSetter,
        'accesses': makeAccessor
      };

      function makeNameToken(prefix, name) {
        return $token(Token.identify(prefix + name.charAt(0).toUpperCase() + name.substring(1)).token);
      }

      function methodAlreadyExists(methodName) {
        return scope.classContext.isInContext(methodName);
      }

      function makeGetter(variable) {
        var nameToken = variable.children('.name');
        var name = nameToken.text();
        var getterName = makeNameToken('get', name);

        if (methodAlreadyExists(getterName.text())) return;

        var getter = $node('method', [
          getterName,
          $node('parameter_list'),
          $node('function_body', [
            $statement(
              $node('keyword_statement', [
                $token(Token.RETURN),
                $node('member_identifier', [nameToken], ['name'])
              ], [
                'keyword',
                'expression'
              ])
            )
          ])
        ], [
          'name',
          'parameters',
          'body'
        ]);

        var memberIdentifier = getter.find('member_identifier');
        this.handleMatch(memberIdentifier, this.onMemberIdentifier, scope);

        return getter;
      }

      function makeSetter(variable) {
        var nameToken = variable.children('.name');
        var name = nameToken.text();
        var setterName = makeNameToken('set', name);

        if (methodAlreadyExists(setterName.text())) return;

        var setter = $node('method', [
            setterName,
            $node('parameter_list', [
              $node('auto_set_param', [
                $node('variable_declaration', [nameToken], ['name', 'value'])
              ])
            ]),
            $node('function_body', [])
          ], [
            'name',
            'parameters',
            'body'
          ]);

        var autoSetParam = setter.find('auto_set_param');

        // We can just let the auto-setting param logic do this for us.
        this.handleMatch(autoSetParam, this.onAutoSetParam, scope);

        return setter;
      }

      function makeAccessor(variable) {
        var getter = makeGetter.call(this, variable);
        var setter = makeSetter.call(this, variable);
        var methods = [];

        if (getter) methods.push(getter);
        if (setter) methods.push(setter);

        return methods;
      }

      var _this = this;
      variables.each(function() {
        var variable = $(this);

        var nameToken = variable.children('.name');
        var name = nameToken.text();

        var methods = typeMap[type].call(_this, variable);
        classBody.append.apply(classBody, methods);
      });

      return null;
    }
  });
}(jQuery);
