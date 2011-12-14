function SourceElements() {
  this.elements = [];
};

SourceElements.prototype.add = function(element) {
  element && this.elements.push(element);
};

SourceElements.prototype.compile = function() {
  for (var i = 0, len = this.elements.length; i < len; ++i) {
    compiler.newline();
    compiler.out(this.elements[i]);
  }
};
