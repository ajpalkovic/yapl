function Symbol(name) {
  this.name = name;
};

Symbol.get = function(name) {
  if (Symbol.definedSymbols[name]) return Symbol.definedSymbols[name];

  return new Symbol(name);
};

Symbol.definedSymbols = {};

Symbol.prototype.compile = function() {
  // TODO: make each symbol have only 1 instance of itself in the actual JS code
  compiler.out(new StringLiteral(this.name));
};
