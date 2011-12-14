function Parameters(parameterList, varargs) {
  this.parameterList = parameterList || new ParameterList();
  this.varargs = varargs;
};

Parameters.prototype.compile = function() {
  compiler.out('(', this.parameterList, ')');
};
