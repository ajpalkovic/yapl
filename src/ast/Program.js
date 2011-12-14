function Program(sourceElements) {
  this.sourceElements = sourceElements;
};

Program.prototype.compile = function() {
  try {
    this.sourceElements && this.sourceElements.compile();
  } finally {
    var out = compiler.flushOut();
    console.log(out);
  }
};
