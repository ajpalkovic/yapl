function PrimaryExpression(primaryExpression) {
  this.primaryExpression = primaryExpression;
};

PrimaryExpression.prototype.compile = function() {
  if (typeof this.primaryExpression !== 'string') {
    this.primaryExpression.compile();
    return;
  }

  switch(this.primaryExpression) {
    case 'SUPER':
      compiler.out('__super');
      break;
    case 'THIS':
      compiler.out('this');
      break;
    default:
      // This should only be numeric literals... this is kind of ugly.
      compiler.out(this.primaryExpression);
  }
};
