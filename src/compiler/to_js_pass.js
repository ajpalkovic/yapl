!function($) {
  function makeListHandler(delimiter) {
    return function(list, emitter) {
      var children = list.children();
      var size = children.size();

      children.each(function(i) {
        var child = $(this);

        emitter.e(child);
        if (i < size - 1 && delimiter !== undefined) emitter.e(delimiter);
      });
    };
  }

  var ToJsEmitter = klass(pass, pass.EmitterPass, {
    initialize: function ToJsEmitter() {
      pass.EmitterPass.prototype.initialize.call(this, {
        'program': this.onNewlineList,
        'function_declaration': this.onFunctionDeclaration,
        'function_expression': this.onFunctionExpression,
        'empty_list': this.onList,
        'parameter_list': this.onCommaList,
        'function_body': this.onNewlineList,
        'array_literal': this.onArrayLiteral,
        'array_element_list': this.onCommaList,
        'object_literal': this.onObjectLiteral,
        'property_list': this.onCommaNewlineList,
        'property': this.onProperty,
        'assignment_expression': this.onExpression,
        'expression_list': this.onCommaList,
        'conditional_expression': this.onConditionalExpression,
        'simple_expression': this.onExpression,
        'additive_expression': this.onExpression,
        'term': this.onExpression,
        'exponentiation_expression': this.onExpression,
        'unary_expression': this.onUnaryExpression,
        'postfix_increment_expression': this.onPostfixIncrementExpression,
        'prefix_increment_expression': this.onUnaryExpression,
        'new_expression': this.onNewExpression,
        'member_expression': this.onMemberExpression,
        'property_access': this.onPropertyAccess,
        'bind_expression': this.onBindExpression,
        'array_dereference': this.onArrayDereference,
        'call': this.onCall,
        'argument_list': this.onCommaList,
        'this': this.onThis,
        'regex_literal': this.onRegexLiteral,
        'single_string_literal': this.onStringLiteral,
        'double_string_literal': this.onStringLiteral,
        'identifier_reference': this.onIdentifierReference,
        'primitive_literal_expression': this.onPrimitiveLiteralExpression,
        'nested_expression': this.onNestedExpression,
        'operator': this.onOperator,
        'terminated_statement': this.onTerminatedStatement,
        'statement_list': this.onNewlineList,
        'end_st': this.onEndSt,
        'variable_statement': this.onVariableStatement,
        'variable_declaration_list': this.onCommaList,
        'variable_declaration': this.onVariableDeclaration,
        'if_statement': this.onIfStatement,
        'else_part': this.onElsePart,
        'else_if_list': this.onList,
        'else_if': this.onElseIf,
        'while_loop': this.onWhileLoop,
        'do_while_loop': this.onDoWhileLoop,
        'for_loop': this.onForLoop,
        'standard_for_structure': this.onStandardForStructure,
        'for_in_structure': this.onForInStructure,
        'with_statement': this.onWithStatement,
        'switch_statement': this.onSwitchStatement,
        'case_block': this.onCaseBlock,
        'case_list': this.onNewlineList,
        'case': this.onCase,
        'default_case': this.onDefaultCase,
        'try_statement': this.onTryStatement,
        'catch': this.onCatch,
        'exception_var_declaration': this.onExceptionVarDeclaration,
        'finally': this.onFinally,
        'keyword_statement': this.onKeywordStatement,
      });
    },

    onList: makeListHandler(),

    onNewlineList: makeListHandler('\n'),

    onCommaList: makeListHandler(', '),

    onCommaNewlineList: makeListHandler(',\n'),

    onFunctionDeclaration: function(functionDeclaration, emitter) {
      var name = functionDeclaration.children('.name');
      var parameters = functionDeclaration.children('.parameters');
      var body = functionDeclaration.children('.body');

      emitter.e('function ', name, '(', parameters, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onFunctionExpression: function(functionExpression, emitter) {
      var name = functionExpression.children('.name');
      var parameters = functionExpression.children('.parameters');
      var body = functionExpression.children('.body');

      emitter.e('function ', name, '(', parameters, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onArrayLiteral: function(arrayLiteral, emitter) {
      var arrayElements = arrayLiteral.children('.elements');

      emitter.e('[', arrayElements, ']');
    },

    onObjectLiteral: function(objectLiteral, emitter) {
      var propertyList = objectLiteral.children('property_list');

      emitter.e('{').blk()
        .e(propertyList)
      .end().e('}');
    },

    onProperty: function(property, emitter) {
      var name = property.children('.name');
      var value = property.children('.value');

      emitter.e(name, ': ', value);
    },

    onExpression: function(assignmentExpression, emitter) {
      var left = assignmentExpression.children('.left');
      var operator = assignmentExpression.children('.operator');
      var right = assignmentExpression.children('.right');

      emitter.e(left, ' ', operator, ' ', right);
    },

    onConditionalExpression: function(conditionalExpression, emitter) {
      var condition = conditionalExpression.children('.condition');
      var truePart = conditionalExpression.children('.truePart');
      var falsePart = conditionalExpression.children('.falsePart');

      emitter.e(condition, ' ? ', truePart, ' : ', falsePart);
    },

    onUnaryExpression: function(unaryExpression, emitter) {
      var operator = unaryExpression.children('.operator');
      var expression = unaryExpression.children('.expression');

      emitter.e(operator, expression);
    },

    onPostfixIncrementExpression: function(postfixIncrementExpression, emitter) {
      var expression = unaryExpression.children('.expression');
      var operator = unaryExpression.children('.operator');

      emitter.e(expression, operator);
    },

    onNewExpression: function(newExpression, emitter) {
      var expression = newExpression.children();

      emitter.e('new ', expression);
    },

    onPropertyAccess: function(propertyAccess, emitter) {
      var member = propertyAccess.children('.member');
      var memberPart = propertyAccess.children('.memberPart');

      emitter.e(member, '.', memberPart);
    },

    onArrayDereference: function(arrayDereference, emitter) {
      var member = arrayDereference.children('.member');
      var memberPart = arrayDereference.children('.memberPart');

      emitter.e(member, '[', memberPart, ']');
    },

    onCall: function(call, emitter) {
      var member = call.children('.member');
      var memberPart = call.children('.memberPart');

      emitter.e(member, '(', memberPart, ')');
    },

    onThis: function(thisElement, emitter) {
      emitter.e(thisElement.children());
    },

    onRegexLiteral: function(regexLiteral, emitter) {
      emitter.e(regexLiteral.children());
    },

    onStringLiteral: function(stringLiteral, emitter) {
      emitter.e(stringLiteral.children());
    },

    onIdentifierReference: function(identifierReference, emitter) {
      emitter.e(identifierReference.children('token'));
    },

    onPrimitiveLiteralExpression: function(primitiveLiteralExpression, emitter) {
      var value = primitiveLiteralExpression.children('.value');

      emitter.e(value);
    },

    onNestedExpression: function(nestedExpression, emitter) {
      emitter.e('(', nestedExpression.children(), ')');
    },

    onOperator: function(operator, emitter) {
      emitter.e(operator.children('token'));
    },

    onTerminatedStatement: function(terminatedStatement, emitter) {
      var statement = terminatedStatement.children('.statement');

      emitter.e(statement, ';');
    },

    onVariableStatement: function(variableStatement, emitter) {
      var declarations = variableStatement.children('variable_declaration_list');

      emitter.e('var ', declarations);
    },

    onVariableDeclaration: function(variableDeclaration, emitter) {
      var name = variableDeclaration.children('.name');
      var value = variableDeclaration.children('.value');

      if (value.size()) {
        emitter.e($assignment(name, value));
      } else {
        emitter.e(name);
      }
    },

    onIfStatement: function(ifStatement, emitter) {
      var condition = ifStatement.children('.condition');
      var body = ifStatement.children('.body');
      var elseIfs = ifStatement.children('else_if_list');
      var elsePart = ifStatement.children('else_part');

      emitter.e('if (', condition, ') {').blk()
        .e(body)
      .end().e('}')
      .e(elseIfs)
      .e(elsePart)
    },

    onElsePart: function(elsePart, emitter) {
      var body = elsePart.children('.body');

      emitter.e(' else {').blk()
        .e(body)
      .end().e('}');
    },

    onElseIf: function(elseIf, emitter) {
      var condition = elseIf.children('.condition');
      var body = elseIf.children('.body');

      emitter.e(' else ', $node('if_statement', [
        condition,
        body
      ], [
        'condition',
        'body'
      ]));
    },

    onWhileLoop: function(whileLoop, emitter) {
      var condition = whileLoop.children('.condition');
      var body = whileLoop.children('.body');

      emitter.e('while (', condition, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onDoWhileLoop: function(doWhileLoop, emitter) {
      var body = doWhileLoop.children('.body');
      var condition = doWhileLoop.children('.condition');

      emitter.e('do {').blk()
        .e(body)
      .end().e('} while (', condition, ');');
    },

    onForLoop: function(forLoop, emitter) {
      var structure = forLoop.children('.structure');
      var body = forLoop.children('.body');

      emitter.e('for (', structure, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onForInStructure: function(forInStructure, emitter) {
      var key = forInStructure.children('.key');
      var collection = forInStructure.children('.collection');

      emitter.e(key, ' in ', collection);
    },

    onStandardForStructure: function(standardForStructure, emitter) {
      var variable = standardForStructure.children('.variable');
      var condition = standardForStructure.children('.condition');
      var increment = standardForStructure.children('.increment');

      emitter.e(variable, ' ', condition, ' ', increment);
    },

    onWithStatement: function(withStatement, emitter) {
      var scope = withStatement.children('.scope');
      var body = withStatement.children('.body');

      emitter.e('with (', scope, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onSwitchStatement: function(switchStatement, emitter) {
      var condition = switchStatement.children('.condition');
      var cases = switchStatement.children('.cases');

      emitter.e('switch (', condition, ') {').blk()
        .e(cases)
      .end().e('}');
    },

    onCaseBlock: function(caseBlock, emitter) {
      var cases = caseBlock.children('.cases');
      var defaultCase = caseBlock.children('.default');

      emitter.e(cases, defaultCase);
    },

    onCase: function(caseElement, emitter) {
      var expression = caseElement.children('.expressions');
      var body = caseElement.children('.body');

      if (body.children().size()) {
        emitter.e('case ', expression, ':').blk()
          .e(body)
        .end();
      } else {
        emitter.e('case ', expression, ':');
      }
    },

    onDefaultCase: function(defaultCase, emitter) {
      var body = defaultCase.children('.body');

      emitter.e('default:').blk()
        .e(body)
      .end();
    },

    onTryStatement: function(tryStatement, emitter) {
      var body = tryStatement.children('.body');
      var catchElement = tryStatement.children('.catch');
      var finallyElement = tryStatement.children('.finally');

      emitter.e('try {').blk()
        .e(body)
      .end().e('}')
      .e(catchElement)
      .e(finallyElement)
    },

    onCatch: function(catchElement, emitter) {
      var exception = catchElement.children('.exception');
      var body = catchElement.children('.body');

      emitter.e(' catch (', exception, ') {').blk()
        .e(body)
      .end().e('}');
    },

    onExceptionVarDeclaration: function(exceptionVarDeclaration, emitter) {
      emitter.e(exceptionVarDeclaration.children('.name'));
    },

    onFinally: function(finallyElement, emitter) {
      var body = finallyElement.children('.body');

      emitter.e(' finally {').blk()
        .e(body)
      .end().e('}');
    },

    onKeywordStatement: function(keywordStatement, emitter) {
      var keyword = keywordStatement.children('.keyword');
      var expression = keywordStatement.children('.expression');

      if (expression.size()) {
        emitter.e(keyword, ' ', expression);
      } else {
        emitter.e(keyword);
      }
    }
  });
}(jQuery);