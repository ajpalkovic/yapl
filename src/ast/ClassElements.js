function ClassElements() {
  this.elements = [];
};

ClassElements.prototype.add = function(element) {
  this.elements.push(element);
};

ClassElements.prototype.compile = function() {
  for (var i = 0, len = this.elements.length; i < len; ++i) {
    compiler.newline();
    this.elements[i].compile();
  }
};
