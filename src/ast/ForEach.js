function ForEach(item, collection, index) {
  this.item = item;
  this.collection = collection;
  this.index = index;
};

ForEach.prototype.compile = function() {
  compiler.out(this.item, ' in ', this.collection);
};
