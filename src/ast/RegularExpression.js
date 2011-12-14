function RegularExpression(regularExpression) {
  this.regularExpression = this.fixWhitespace(regularExpression);
};

RegularExpression.prototype.fixWhitespace = function(regularExpression) {
  return regularExpression.replace(' ', '\\s');
};

RegularExpression.prototype.compile = function() {
  compiler.out(this.regularExpression);
};
