function IncrementExpression(prefix, operand, postfix) {
   this.prefix = prefix; 
   this.operand = operand; 
   this.postfix = postfix; 
};

IncrementExpression.prototype.compile = function() {
  compiler.out(this.prefix, this.operand, this.postfix);
};
