function ForLoop(conditions, body) {
  this.conditions = conditions;
  this.body = body;
};

ForLoop.prototype.compile = function() {
  var neededTempIndex = undefined;
  var neededTempValue = undefined;

  function setupTempVariables(expression, initialValue) {
    // if we have this variable already in the scope, set a temp var so we don't lose the value
    // when we come out of the for loop.

    if (compiler.currentScope.variables[expression]) {
      compiler.out(this.makeTemp(expression));

      compiler.out(new TerminatedStatement(new AssignmentExpression(
                                           expression,
                                           new Operator('='),
                                           initialValue)));

      return true;
    } else {
      var decl = new VariableDeclaration(expression, initialValue);
      compiler.out(new TerminatedStatement(new VariableStatement(decl)));
    }

    compiler.newline();
  }




  
  if (this.conditions.index) {
    neededTempIndex = setupTempVariables(this.conditions.index, '-1');
    var varname = neededTempIndex ? '__TEMP__' : '' + this.conditions.index;

    this.body.statementList.elements.splice(0, 0,
        new TerminatedStatement(new IncrementExpression(new Operator('++'), varname)));
  }

  if (this.conditions.value) {
    neededTempValue = setupTempVariables(this.conditions.value, 'undefined');
    var varname = neededTempValue ? '__TEMP__' : '' + this.conditions.value;

    var dereference = new ArrayMemberAccess(this.conditions.collection, new ArrayDereference(this.conditions.key));

    this.body.statementList.elements.splice(0, 0, 
        new TerminatedStatement(new AssignmentExpression(
                                varname,
                                new Operator('='),
                                dereference)));
  }

  compiler.out('for (', this.conditions, ') ', this.body);

  neededTempIndex && compiler.out(this.restoreFromTemp(this.conditions.index));
  neededTempValue && compiler.out(this.restoreFromTemp(this.conditions.value));
};

ForLoop.prototype.makeTemp = function(identifier) {
  return new TerminatedStatement(new AssignmentExpression(
                                 '__TEMP__' + identifier,
                                 new Operator('='),
                                 identifier));
};

ForLoop.prototype.restoreFromTemp = function(identifier) {
  return new TerminatedStatement(new AssignmentExpression(
                                 identifier,
                                 new Operator('='),
                                 '__TEMP__' + identifier));
};
