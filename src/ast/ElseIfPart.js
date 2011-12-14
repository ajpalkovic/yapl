function ElseIfPart() {
  this.elements = [];
};

ElseIfPart.prototype.add = function(element) {
  this.elements.push(element);
};

ElseIfPart.prototype.compile = function() {
  for (var i = 0, len = this.elements.length; i < len; ++i) {
    this.elements[i].compile();
  }
};
