function ClassDeclaration(name, parentClass, classBody) {
  this.name = name;
  this.parentClass = parentClass;
  this.classBody = classBody;
};

ClassDeclaration.prototype.compile = function() {
  this.enter();
  this.doCompile();
  this.leave();
};

ClassDeclaration.prototype.enter = function() {
  compiler.currentScope.classes[this.name] = this;
  compiler.pushScope(this.name);
};

ClassDeclaration.prototype.leave = function() {
  compiler.popScope();
};

ClassDeclaration.prototype.doCompile = function() {
  var constructor = undefined;
  var constructorIndex = 0;

  console.log(this.classBody.elements);

  for (var i = 0, len = this.classBody.elements.length; i < len; ++i) {
    var classElement = this.classBody.elements[i];

    if (classElement instanceof Method) {
        classElement.classContext = this;

        if (classElement.isConstructor()) {
          
          // We can't have more than one constructor yet...
          if (constructor) {
            throw new Error('Duplicate constructor: not supported yet!');
          }

          constructor = classElement.functionDeclaration;
          constructorIndex = i;
        }
    }

    // If the element is an instance var, we want to compile it so it adds the
    // variables to the symbol table.
    if (classElement instanceof InstanceVarDeclaration) classElement.compile();
  }
  
  if (!constructor) {
    constructor = new FunctionDeclaration(this.name, new Parameters(), new SourceElements());
  } else {
    // Remove the constructor from the class elements, as to not print it twice.
    this.classBody.elements.splice(constructorIndex , 1);
  }

  var constructorBody = constructor.functionBody;
  var instanceVars = compiler.currentScope.variables;

  var staticVars = [];

  // Add all instance vars to the beginning of the constructor.
  for (var varName in instanceVars) {
    var currentVar = instanceVars[varName];

    // Except if it's static, save it for later...
    if (currentVar.isStatic) {
      console.log(currentVar);
      currentVar = new TerminatedStatement(
          new AssignmentExpression(new MemberAccess(this.name, currentVar.name),
                                   new AssignmentOperator('ASSIGN'),
                                   currentVar.value || 'undefined'));
      staticVars.push(currentVar);
      continue;
    }

    // Convert the declaration into an assignment expression with a new member expression
    // on the left hand side.
    var memberVarInit = new TerminatedStatement(
          new AssignmentExpression(new MemberIdentifier(currentVar.name), 
                                   new AssignmentOperator('ASSIGN'),
                                   currentVar.value || 'undefined'));

    constructorBody.add(memberVarInit);

    // switch (currentVar.visibility) {
    //   case 'GETTER':
    //     this.generateGetter(currentVar);
    //     break;
    //   case 'SETTER':
    //     this.generateSetter(currentVar);
    //     break;
    //   case 'ACCESS':
    //     this.generateGetter(currentVar);
    //     this.generateSetter(currentVar);
    //     break;
    //   default:
    //     break;
    // }
  }

  compiler.out('var ', this.name, ' = (function() {');
  compiler.indent();
  compiler.newline();
  compiler.out('var __super = ', this.parentClass || 'undefined', ';');
  compiler.newline();

  // Write out the constructor
  compiler.out(constructor);

  staticVars.length && compiler.newline();

  // Print out the static variables
  for (var i = 0, len = staticVars.length; i < len; ++i) {
    compiler.newline();
    staticVars[i].compile();
  }

  this.classBody.add(new TerminatedStatement(new ReturnStatement(this.name)));
  compiler.out(this.classBody);

  compiler.undent();
  compiler.newline();
  compiler.out('})();');
};

ClassDeclaration.prototype.generateGetter = function(variable) {
};

ClassDeclaration.prototype.generateSetter = function(variable) {
  
};
