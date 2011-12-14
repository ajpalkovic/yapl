function RegularForLoop(variables, condition, increment) {
  this.variables = variables;
  this.condition = condition;
  this.increment = increment;
};

RegularForLoop.prototype.compile = function() {
  compiler.out(this.variables, ';', this.condition, ';', this.increment);
};

