!function($) {
  var SyntaxAugmentationTransformer = klass(pass, pass.ScopedTransformer, {
    initialize: function SyntaxAugmentationTransformer() {
      pass.ScopedTransformer.prototype.initialize.call(this, {
        'standard_for_structure': this.onStandardForStructure,
        'for_in_structure': this.onForInStructure,
        'multiple_for_in_structure': this.onMultipleForInStructure,
        'inflected_for_structure': this.onInflectedForStructure,
        'closure': this.onClosure
      });
    },

    wrapWithVariableStatement: function(variableDeclaration, className) {
      variableDeclaration = variableDeclaration.clone();

      variableDeclaration.removeClass(className);

      var variableStatement = $node('variable_statement');
      variableStatement.addClass(className);

      var declarationList = $node('variable_declaration_list');
      variableDeclaration.wrap(variableStatement).wrap(declarationList);

      return variableDeclaration.parent().parent();
    },

    setDefaultValue: function(variableDeclaration, value) {
      if (variableDeclaration.children('.value').size()) return;

        var valueToken = new Token({value: value});

        var valueNode = $node('primitive_literal_expression', [$token(valueToken)]);
        valueNode.addClass('value');

        variableDeclaration.append(valueNode);
    },

    addLoopParameters: function(forLoop, collectionToken, index) {
      var indexStatement = this.wrapWithVariableStatement(index, 'variable');
      forLoop.prepend(indexStatement);

      var lengthToken = $token(new Token({value: 'length'}));
      var lengthPropertyAccess = $node('property_access',
          [collectionToken, lengthToken],
          ['member', 'memberPart']);

      var indexName = index.children('.name');
      var lessThanOperator = $node('operator', [Token.LESS_THAN]);
      var comparison = $node('simple_expression',
          [indexName, lessThanOperator, lengthPropertyAccess]);

      comparison.addClass('condition');
      forLoop.prepend(comparison);

      var increment = $node('prefix_increment_expression',
          [Token.INCREMENT, indexName]);

      increment.addClass('increment');
      forLoop.prepend(increment);
    },

    onForInStructure: function(forInStructure, scope) {
      var forLoop = forInStructure.parent();
      var variable = forInStructure.children('.variable');
      var collection = forInStructure.children('.collection').remove();
      var index = forInStructure.children('.index').remove();
      var body = forLoop.children('.body');

      // First wrap the loop variable with a statement and declare it before
      // the loop.
      this.wrapWithVariableStatement(variable, 'variable').insertBefore(forLoop);

      // Then we assign whatever the collection was to a variable so we can access it.
      var collectionToken = $token(new Token({value: '__collection'}));
      var collectionDeclaration = $node('variable_declaration',
          [collectionToken, collection],
          ['name', 'value']);

      this.wrapWithVariableStatement(collectionDeclaration, 'collection').insertBefore(forLoop);


      if (!index.size()) {
        var tokenNode = $token(new Token({value: '__i'}));
        index = $node('variable_declaration', [tokenNode], ['name']);
        index.addClass('index');
      }

      this.setDefaultValue(index, 0);

      variable = variable.clone();

      var variableToken = variable.children('.name');
      var variableValue = $node('array_dereference',
        [collectionToken, index.children('.name')]);

      var variableAssignment = $node('assignment_expression',
        [variableToken, $token(Token.ASSIGN), variableValue],
        ['left', 'operator', 'right']);

      body.prepend(variableAssignment);

      this.addLoopParameters(forLoop, collectionToken, index);
      forInStructure.remove();
    },

    onMultipleForInStructure: function(multipleForInStructure, scope) {

    },

    onInflectedForStructure: function(inflectedForStructure, scope) {

    }
  });
}(jQuery);