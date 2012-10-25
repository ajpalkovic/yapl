!function($) {
  var Node = klass({
    initialize: function Node(type, children, childNames) {
      this.type = type;
      this.children = [];

      this.addAll(children || [], childNames || []);
    },

    addAll: function(children, childNames) {
      var merged = children.zip(childNames);

      merged.each(function(childAndName, i) {
        this.add(childAndName[0], childAndName[1]);
      }.bind(this));
    },

    add: function(child, name) {
      if (!child) return;

      if (name) {
        var childName = name;
      } else {
        var childName = child instanceof Token ? child.type : child.type[0].toLowerCase() + child.type.substring(1);
      }

      if (this[childName]) {
        var number = parseInt(childName[childName.length - 1]);
        var incremented = isNaN(number) ? 1 : number + 1;

        childName = childName + incremented;
      }

      this.children.prepend(child);
      this[childName] = child;
    },

    _toStringChildren: function(emitter) {
      var length = this.children.length;

      $.each(this.children, function(i, child) {
        if (child instanceof Token) {
          emitter.e('"', child, '"');
        } else {
          child._toString(emitter);
        }

        if (i < length - 1) emitter.nl();
      });
    },

    _toString: function(emitter) {
      emitter.e('(', this.type).blk();
      this._toStringChildren(emitter);
      emitter.end().e(')');
    },

    toString: function() {
      var emitter = new Emitter();
      this._toString(emitter);
      return emitter.flush();
    }
  });

  // These are already in the cache because they are not lexed as static tokens
  // because of the unary vs. binary ambiguity.
  Node.operatorCache = {
    '+': new Node('Operator', [Token.PLUS], ['value']),
    '-': new Node('Operator', [Token.MINUS], ['value'])
  };

  Node.makeOperator = function(token) {
    if (!Node.operatorCache[token.value]) {
      Node.operatorCache[token.value] = new Node('Operator', [token], ['value']);
    }

    return Node.operatorCache[token.value];
  };
}(jQuery);