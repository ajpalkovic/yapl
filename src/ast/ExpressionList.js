function ExpressionList() {
  this.elements = [];
};

ExpressionList.prototype.add = function(element) {
  this.elements.push(element);
};

ExpressionList.prototype.compile = function() {
  for (var i = 0, len = this.elements.length; i < len; ++i) {
    var comma = (i == len - 1) ? '' : ', ';
    compiler.out(this.elements[i], comma);
  }
};
