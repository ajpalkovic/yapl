!function($) {
  pass = {};

  var Pass = klass(pass, {}, {
    initialize: function Pass(adapter) {
      this.adapter = adapter;
    },

    run: function(tree, data) {
      if (!tree.children().length) return tree;

      tree.children().map(function(i, child) {
        if (!child) return;

        this.handleChild(tree, $(child), i, data);
      }.bind(this));

      return tree;
    },

    handleChild: function(parent, child, index, data) {}
  });

  var Transformer = klass(pass, Pass, {
    initialize: function Transformer(adapter) {
      Pass.prototype.initialize.call(this, adapter);
    },

    handleChild: function(parent, child, index, data) {
      parent.children().get(index) = this.run(child, data);
    }
  });

  var Adapter = klass(pass, {}, {
    initialize: function Adapter() {},

    handlerNameForNode: function(node) {
      return 'on' + node.type;
    },

    handles: function(node) {
      return !!this[this.handlerNameForNode(node)];
    },

    handle: function(node, data) {
      return this[this.handlerNameForNode(node)](node, data);
    }
  });
}(jQuery);