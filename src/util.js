(function($) {
  Array.prototype.insert = function(index, value) {
    Array.prototype.splice.call(this, index, 0, value);
  };

  Array.prototype.prepend = function(value) {
    Array.prototype.insert.call(this, 0, value);
  };

  Array.prototype.peek = function() {
    return this[this.length - 1];
  };

  Function.create = function(name, arguments, body) {
    return eval('(function ' + name + '(' + arguments + ') {' + body + '})');
  };

  $.overload = function() {
    var fns = Array.prototype.slice.call(arguments, 0);
    var table = {};

    for (var i = 0, len = fns.length; i < len; ++i) {
      var fn = fns[i];
      table[fn.length] = fn;
    }

    return function() {
      var fn = table[arguments.length];
      return fn.apply(this, arguments);
    };
  };

  $.each = function( obj, callback, args ) {
    var name,
      i = 0,
      length = obj.length,
      isObj = length === undefined || jQuery.isFunction( obj );

    if ( args ) {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.apply( obj[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( obj[ i++ ], args ) === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          // CONSISTENT W/ PROTOTYPE!!!!
          if ( callback.call( obj[i], obj[i] , i++) === false ) {
            break;
          }
        }
      }
    }

    return obj;
  };

  $.makeNode = function(type, children, childNames) {
    type = type[0].toLowerCase() + type.substring(1).gsub(/([A-Z])/, function(match) {
      return '_' + match[0].toLowerCase();
    })

    children = children || [];
    childNames = childNames || [];

    var node = $('<' + type + '>');
    var merged = children.zip(childNames);

    merged.each(function(childAndName, i) {
      childAndName[0] = childAndName[0] instanceof Token ? $.makeTokenNode(childAndName[0]) : childAndName[0];

      if (childAndName[0] && childAndName[1]) childAndName[0].attr('class', childAndName[1]);

      node.append(childAndName[0]);
    }.bind(this));

    return node;
  };

  $.makeTokenNode = function(token) {
    var node = $.makeNode('token');
    node.attr('type', token.type);
    node.text(token.value);

    return node;
  }

  $.fn.each = function( callback, args ) {
    return jQuery.each( this, callback, args );
  };

  $.fn.type = function() {
    return this.prop('tagName').toLowerCase();
  };

  window.$S = function(items, delimeter) {
    items = (typeof items === 'string') ? items.split(delimeter || '') : items;
    var object = {};

    $.each(items, function(index, value) {
      object[value] = true;
    });

    return object;
  }

  window.klass = $.overload(function(methods) {
      return klass({}, methods);
    },

    function(parent, methods) {
      return klass(window, parent, methods);
    },

    function(namespace, parent, methods) {
      var name = methods.initialize ? methods.initialize.name : 'klass';
      var klass = Function.create(name, [], 'this.initialize.apply(this, arguments);');

      namespace[name] = klass;

      if (parent) {
        var subclass = Function.create(parent.name, [], '');
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass;
      }

      for(var name in methods) {
        klass.prototype[name] = methods[name];
      }

      klass.prototype.constructor = klass;

      if (!klass.prototype.initialize)
        klass.prototype.initialize = function() {};

      return klass;
    });
})(jQuery);
