function FunctionBody(sourceElements) {
  this.sourceElements = sourceElements;
};

FunctionBody.prototype.compile = function() {
  this.sourceElements && this.sourceElements.compile();
};
