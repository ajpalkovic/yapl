!function($) {
  var Node = klass({
    initialize: function Node(type, children, childNames) {}
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