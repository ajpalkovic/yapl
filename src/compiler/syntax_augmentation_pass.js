!function($) {
  var NEW_METHOD_NAME = 'new';

  function wrapWithVariableStatement(variableDeclaration, className) {
    variableDeclaration = variableDeclaration.clone();

    variableDeclaration.removeClass(className);

    var variableStatement = $node('variable_statement');
    variableStatement.addClass(className);

    var declarationList = $node('variable_declaration_list');
    variableDeclaration.wrap(variableStatement).wrap(declarationList);

    return variableDeclaration.parent().parent();
  }

  function setDefaultValue(variableDeclaration, value) {
    if (variableDeclaration.children('.value').size()) return;

    var valueToken = new Token({value: value});

    var valueNode = $node('primitive_literal_expression', [$token(valueToken)]);
    valueNode.addClass('value');

    variableDeclaration.append(valueNode);
  }

  var SyntaxAugmentationTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function SyntaxAugmentationTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'standard_for_structure': this.onStandardForStructure,
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
        'case': this.onCase
      });
    },

    onForInStructure: function(forInStructure, scope) {
      var forLoop = forInStructure.parent();
      var variable = forInStructure.children('.value');
      var collection = forInStructure.children('.collection').remove();
      var index = forInStructure.children('.index').remove();
      var body = forLoop.children('.body');

      // First wrap the loop variable with a statement and declare it before
      // the loop.
      wrapWithVariableStatement(variable, 'variable').insertBefore(forLoop);

      // Then we assign whatever the collection was to a variable so we can access it.
      var collectionToken = $token(Token.identify('__collection').token);
      var collectionDeclaration = $node('variable_declaration',
          [collectionToken, collection],
          ['name', 'value']);

      wrapWithVariableStatement(collectionDeclaration, 'collection').insertBefore(forLoop);

      if (!index.size()) {
        var tokenNode = $token(Token.identify('__i').token);
        index = $node('variable_declaration', [tokenNode], ['name']);
        index.addClass('index');
      }

      setDefaultValue(index, 0);

      var indexName = index.children('.name');
      var variableToken = variable.children('.name');
      var variableValue = $node('array_dereference',
        [collectionToken, index.children('.name')]);

      var variableAssignment = $assignment(variableToken, variableValue);

      body.prepend(variableAssignment);

      return $node('standard_for_structure', [
        wrapWithVariableStatement(index, 'variable'),

        $node('simple_expression', [
          indexName,
          Token.LESS_THAN,
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
        ]),

        $node('prefix_increment_expression', [Token.INCREMENT, indexName])
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

      // Wrap the key variable.
      wrapWithVariableStatement(key, 'key').insertBefore(forLoop);
      wrapWithVariableStatement(value, 'value').insertBefore(forLoop);

      var collectionToken = $token(Token.identify('__collection').token);
      var collectionDeclaration = $node('variable_declaration',
          [collectionToken, collection],
          ['name', 'value']);

      wrapWithVariableStatement(collectionDeclaration, 'collection').insertBefore(forLoop);

      if (!index.size()) {
        var tokenNode = $token(Token.identify('__i').token);
        index = $node('variable_declaration', [tokenNode], ['name']);
        index.addClass('index');
      }

      setDefaultValue(index, 0);
      wrapWithVariableStatement(index, 'index').insertBefore(forLoop);

      var indexName = index.children('.name');
      var keyName = key.children('.name');
      var valueName = value.children('.name');

      var valueAtKey = $node('array_dereference', [collectionToken, keyName], ['member', 'memberPart']);
      var valueAssignment = $assignment(valueName, valueAtKey);

      body.prepend(valueAssignment);

      var indexIncrement = $node('prefix_increment_expression', [Token.INCREMENT, indexName]);
      body.append(indexIncrement);

      return $node('for_in_structure', [
        keyName,
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
      ]);

      return $node('while_loop', [
        negation,
        body
      ], [
        'condition',
        'body',
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

        if (i === length - 1) {
          var newCase = $node('case', [expression, body], ['expressions', 'body']);
        } else {
          var newCase = $node('case', [expression], ['expressions']);
        }

        newCases = newCases.add(newCase);
      });

      return newCases;
    }
  });
}(jQuery);