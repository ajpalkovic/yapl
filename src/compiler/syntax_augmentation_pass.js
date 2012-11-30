!function($) {
  var NEW_METHOD_NAME = 'new';

  function setDefaultValue(variableDeclaration, value) {
    if (variableDeclaration.children('.value').size()) return;

    var valueToken = new Token({value: value});

    var valueNode = $node('primitive_literal_expression', [$token(valueToken)], ['value']);
    valueNode.addClass('value');

    variableDeclaration.append(valueNode);
  }

  var SyntaxAugmentationTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function SyntaxAugmentationTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'for_in_structure': this.onForInStructure,
        'multiple_for_in_structure': this.onMultipleForInStructure,
        'inflected_for_structure': this.onInflectedForStructure,
        'symbol': this.onSymbol,
        'property_access': this.onPropertyAccess,
        'parallel_assignment_expression': this.onParallelAssignmentExpression,
        'regex_literal': this.onRegexLiteral,
        'double_string_literal, single_string_literal': this.onStringLiteral,
        'unless_statement': this.onUnlessStatement,
        'until_loop': this.onUntilLoop,
        'do_until_loop': this.onDoUntilLoop,
        'case': this.onCase,
        'bind_expression': this.onBindExpression,
        'property': this.onProperty,
        'assignment_expression': this.onAssignmentExpression,
        'operator': this.onOperator,
        'one_line_if_statement': this.onOneLineIfStatement,
        'one_line_unless_statement': this.onOneLineUnlessStatement,
        'exponentiation_expression': this.onExponentiationExpression
      });
    },

    onForInStructure: function(forInStructure, scope) {
      var forLoop = forInStructure.parent();
      var value = forInStructure.children('.value');
      var collection = forInStructure.children('.collection').remove();
      var index = forInStructure.children('.index').remove();
      var body = forLoop.children('.body');

      var collectionToken = $token(Token.identify('__collection').token);

      // Then we assign whatever the collection was to a variable so we can access it.
      $variable(
        collectionToken,
        collection
      ).insertBefore(forLoop);

      if (!index.size()) {
        var tokenNode = $token(Token.identify('__i').token);
        index = $node('variable_declaration', [tokenNode], ['name']);
        index.addClass('index');
      }

      setDefaultValue(index, 0);

      var collectionDeref = $node('array_dereference', [
        collectionToken,
        index.children('.name')
      ], [
        'member',
        'memberPart'
      ]);

      var valueVariableAssignment = $variable(value.children('.name'), collectionDeref);
      body.prepend(valueVariableAssignment);

      return $node('standard_for_structure', [
        $variable(index.children('.name'), index.children('.value')),

        $statement($node('simple_expression', [
          index.children('.name'),

          $node('operator', [Token.LESS_THAN]),

          $node('property_access', [
            collectionToken,
            Token.identify('length').token
          ], [
            'member',
            'memberPart'
          ])
        ], [
          'left',
          'operator',
          'right'
        ])),

        $node('prefix_increment_expression', [
          Token.INCREMENT,
          index.children('.name')
        ], [
          'operator',
          'expression'
        ])
      ], [
        'variable',
        'condition',
        'increment'
      ]);
    },

    onMultipleForInStructure: function(multipleForInStructure, scope) {
      var forLoop = multipleForInStructure.parent();
      var key = multipleForInStructure.children('.key');
      var value = multipleForInStructure.children('.value');
      var collection = multipleForInStructure.children('.collection').remove();
      var index = multipleForInStructure.children('.index').remove();
      var body = forLoop.children('.body');

      var collectionToken = $token(Token.identify('__collection').token);

      // Then we assign whatever the collection was to a variable so we can access it.
      $variable(
        collectionToken,
        collection
      ).insertBefore(forLoop);

      if (!index.size()) {
        var tokenNode = $token(Token.identify('__i').token);
        index = $node('variable_declaration', [tokenNode], ['name']);
        index.addClass('index');
      }

      setDefaultValue(index, 0);

      var indexName = index.children('.name');
      var keyName = key.children('.name');
      var valueName = value.children('.name');

      $variable(
        indexName,
        index.children('.value')
      ).insertBefore(forLoop);

      var collectionDeref = $node('array_dereference', [collectionToken, keyName], ['member', 'memberPart']);

      // Declare the value variable
      var valueVariable = $variable(value.children('.name'), collectionDeref);
      body.prepend(valueVariable);

      var indexIncrement = $node('prefix_increment_expression', [
        $node('operator', [Token.INCREMENT]),
        indexName
      ], [
        'operator',
        'expression'
      ]);

      body.append(indexIncrement);

      return $node('for_in_structure', [
        $node('variable_statement', [
          $node('variable_declaration_list', [
            $node('variable_declaration', [
              keyName
            ], [
              'name'
            ])
          ])
        ]),
        collectionToken
      ], [
        'key',
        'collection'
      ]);
    },

    onInflectedForStructure: function(inflectedForStructure, scope) {
      var collectionName = inflectedForStructure.children('.collection').text();
      var singularToken = Token.identify($.singularize(collectionName)).token;
      var value = $node('variable_declaration', [$token(singularToken)], ['name']);
      value.addClass('value');

      inflectedForStructure.append(value);

      return this.onForInStructure(inflectedForStructure, scope);
    },

    onSymbol: function(symbol, scope) {

    },

    onPropertyAccess: function(propertyAccess, scope) {
      if (propertyAccess.children('.memberPart').text() === NEW_METHOD_NAME) {
        return $node('new_expression', [propertyAccess.children('.member')]);
      }
    },

    onParallelAssignmentExpression: function(parallelAssignmentExpression, scope) {

      var leftHandSides = parallelAssignmentExpression.children('.left').children();
      var rightHandSides = parallelAssignmentExpression.children('.right').children();

      var assignments = $();

      leftHandSides.each(function(i) {
        var leftHandSide = $(this);
        var rightHandSide = rightHandSides[i] ? $(rightHandSides[i]) : $token(Token.UNDEFINED);

        assignments = assignments.add($assignment(leftHandSide, rightHandSide));
      });

      return assignments;
    },

    onRegexLiteral: function(regexLiteral, scope) {
      var regexToken = regexLiteral.children('token');
      var regexText = regexToken.text();

      function stripWhitespace() {
        return regexText.replace(/\s+/g, '');
      }

      var newRegexToken = $token(new Token({type: 'REGEX_LITERAL', value: stripWhitespace()}));

      return $node('regex_literal', [newRegexToken]);
    },

    onStringLiteral: function(stringLiteral, scope, compiler) {
      var stringText = stringLiteral.children('token').text();
      // Remove the quotes.
      stringText = stringText.substring(1, stringText.length - 1);

      var startingLineNumber = parseInt(stringLiteral.children('token').attr('line'));
      var lines = stringText.split('\n');

      var initialIndentation = compiler.parser.lexer.getIndent(startingLineNumber).value;

      var newLines = lines.slice(1).map(function(line, i) {
        try {
          var indentationToken = Token.identify(line).token;
        } catch (e) {
          // Whatever was at the beginning of the line in the string was not a proper
          // lexical token, but since we are in a string and not in the source code,
          // it doesn't matter, so we just say the indentation is empty.
          //
          // eg. x = '
          //     `
          //     '
          var indentationToken = new Token({type: 'WHITESPACE', value: ''});
        }

        var indentation = indentationToken.value;

        if (indentation.length < initialIndentation.length) {
          // TODO: throw an error, the indentation was off.
          throw 'wrong indentation';
        }

        return line.substring(initialIndentation.length);
      });

      newLines.prepend(lines[0]);
      var newStringToken = Token.identify("'" + newLines.join('\n') + "'").token;

      return $node('single_string_literal', [$token(newStringToken)]);
    },

    onUnlessStatement: function(unlessStatement, scope) {
      var condition = unlessStatement.children('.condition');
      var body = unlessStatement.children('.body');

      var negation = $node('unary_expression', [
        $node('operator', [$token(Token.LOGICAL_NOT)]),
        condition
      ], [
        'operator',
        'expression'
      ]);

      return $node('if_statement', [
        negation,
        body
      ], [
        'condition',
        'body',
      ]);
    },

    onUntilLoop: function(untilLoop, scope) {
      var condition = untilLoop.children('.condition');
      var body = untilLoop.children('.body');

      var negation = $node('unary_expression', [
        $node('operator', [$token(Token.LOGICAL_NOT)]),
        condition
      ], [
        'operator',
        'expression'
      ]);

      return $node('while_loop', [
        negation,
        body
      ], [
        'condition',
        'body',
      ]);
    },

    onDoUntilLoop: function(doUntilLoop, scope) {
      var body = doUntilLoop.children('.body');
      var condition = doUntilLoop.children('.condition');

      var negation = $node('unary_expression', [
        $node('operator', [$token(Token.LOGICAL_NOT)]),
        condition
      ], [
        'operator',
        'expression'
      ]);

      return $node('do_while_loop', [
        body,
        negation
      ], [
        'body',
        'condition'
      ]);
    },

    onCase: function(caseElement, scope) {
      var expressions = caseElement.children('.expressions').children();
      var body = caseElement.children('.body');

      if (expressions.size() === 1) return;

      var newCases = $();
      var length = expressions.size();

      expressions.each(function(i) {
        var expression = $(this);

        // The last case in the fall-through has the body.
        if (i === length - 1) {
          var newCase = $node('case', [expression, body], ['expressions', 'body']);
        } else {
          var newCase = $node('case', [expression], ['expressions']);
        }

        newCases = newCases.add(newCase);
      });

      return newCases;
    },

    onBindExpression: function(bindExpression, scope) {
      var member = bindExpression.children('.member');
      var parameters = bindExpression.children('.memberPart').children();

      // We don't want an 'EmptyList' because it won't get printed.
      if (!parameters.size()) parameters = $node('argument_list');

      parameters.prepend($token(Token.THIS));

      var bindFunction = $node('property_access', [
        member,
        $token(Token.identify('bind').token)
      ], [
        'member',
        'memberPart'
      ]);

      return $node('call', [
        bindFunction,
        parameters
      ], [
        'member',
        'memberPart'
      ]);
    },

    onProperty: function(property, scope) {
      if (property.children('.value').size()) return;

      var name = property.children('.name');

      return $node('property', [
        name,
        $node('primitive_literal_expression', [$token(Token.TRUE)], ['value'])
      ], [
        'name',
        'value'
      ]);
    },

    onAssignmentExpression: function(assignmentExpression, scope) {
      var left = assignmentExpression.children('.left');
      var operator = assignmentExpression.children('.operator');
      var right = assignmentExpression.children('.right');

      switch (operator.children('token').attr('type')) {
        case 'EXPONENTIATION_EQUALS':
          var exponentiation = $node('exponentiation_expression', [
            left,
            right
          ], [
            'left',
            'right'
          ]);

          exponentiation = this.onExponentiationExpression(exponentiation);
          return $assignment(left, exponentiation);

        case 'CONDITIONAL_EQUALS':
          return $assignment(
            left,
            $node('simple_expression', [
              left,
              $node('operator', [$token(Token.LOGICAL_OR)]),
              right
            ], [
              'left',
              'operator',
              'right'
            ])
          );
      }
    },

    onOperator: function(operator, scope) {
      switch (operator.children('token').attr('type')) {
        case 'EQUAL':
          return $node('operator', [$token(new Token({type: 'TRIPPLE_EQUAL', value: '==='}))]);
        case 'LIKE':
          return $node('operator', [$token(Token.EQUAL)])
        case 'UNLIKE':
          return $node('operator', [$token(Token.NOT_EQUAL)])
      }
    },

    onOneLineIfStatement: function(oneLineIfStatement, scope) {
      return $node('if_statement', [
        oneLineIfStatement.children('.condition'),
        $statement(oneLineIfStatement.children('.body'))
      ], [
        'condition',
        'body'
      ]);
    },

    onOneLineUnlessStatement: function(oneLineUnlessStatement, scope) {
      return this.onUnlessStatement($node('unless_statement', [
        oneLineUnlessStatement.children('.condition'),
        $statement(oneLineIfStatement.children('.body'))
      ], [
        'condition',
        'body'
      ]));
    },

    onExponentiationExpression: function(exponentiationExpression, scope) {
      var left = exponentiationExpression.children('.left');
      var right = exponentiationExpression.children('.right');

      return $node('call', [
        $node('property_access', [
          $token(Token.identify('Math').token),
          $token(Token.identify('pow').token)
        ], [
          'member',
          'memberPart'
        ]),

        $node('argument_list', [
          left,
          right
        ])
      ], [
        'member',
        'memberPart'
      ]);
    }
  });
}(jQuery);