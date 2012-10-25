!function($) {
  pass = {};

  var Pass = klass(pass, {}, {
    initialize: function Pass(adapter) {
      this.adapter = adapter;
    }
  });

  var Transformer = klass(pass, Pass, {
    initialize: function Transformer(adapter) {
      Pass.prototype.initialize.call(this, adapter);
    },

    run: function(tree) {
      if (this.adapter.handles(tree)) {
        return this.adapter.handle(tree);
      }

      if (!tree.children) return tree;

      tree.children.map(function(child, i) {
        if (!child) return;

        tree.children[i] = this.run(child);
      }.bind(this));

      return tree;
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