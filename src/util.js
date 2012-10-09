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
