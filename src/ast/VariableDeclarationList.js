function VariableDeclarationList() {
  this.elements = [];
};

VariableDeclarationList.prototype.add = function(element) {
  this.elements.push(element);
};

VariableDeclarationList.prototype.compile = function() {
  for (var i = 0, len = this.elements.length; i < len; ++i) {
    this.elements[i].compile();
  }
};
