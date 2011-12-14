function ForKeyValue(key, value, collection, index) {
  this.key = key;
  this.value = value;
  this.collection = collection;
  this.index = index;
};

ForKeyValue.prototype.compile = function() {
  compiler.out(this.key, ' in ', this.collection);
};
