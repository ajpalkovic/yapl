(function($) {
  Array.prototype.insert = function(index, value) {
    this.splice(index, 0, value);
  };

  Array.prototype.prepend = function(value) {
    this.insert(0, value);
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

  // Found the dictionary here: http://lotsacode.wordpress.com/2010/03/05/singularization-pluralization-in-c/
  var singularizationRules = [
    [/people/, 'person'],
    [/oxen/, 'ox'],
    [/children/, 'child'],
    [/feet/, 'foot'],
    [/teeth/, 'tooth'],
    [/geese/, 'goose'],
    // And now the more standard rules.
    [/(.*)ives?/, '$1ife'],
    [/(.*)ves?/, '$1f'],
    // ie, wolf, wife
    [/(.*)men$/, '$1man'],
    [/(.+[aeiou])ys$/, '$1y'],
    [/(.+[^aeiou])ies$/, '$1y'],
    [/(.+)zes$/, '$1'],
    [/([m|l])ice$/, '$1ouse'],
    [/matrices/, 'matrix'],
    [/indices/, 'index'],
    [/(.+[^aeiou])ices$/,'$1ice'],
    [/(.*)ices/, '$1ex'],
    // ie, Matrix, Index
    [/(octop|vir)i$/, '$1us'],
    [/(.+(s|x|sh|ch))es$/, '$1'],
    [/(.+)s/, '$1']
  ];

  $.singularize = function(word) {
    for (var i = 0; i < singularizationRules.length; ++i) {
      var singularizationRule = singularizationRules[i];

      var matches = word.match(singularizationRule[0]);
      if (!matches) continue;

      return word.replace(singularizationRule[0], singularizationRule[1]);
    }

    return word;
  };

  String.prototype.gsub = function(pattern, replacement) {
    var result = '', source = this, match;

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += replacement(match);
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  };

  Array.prototype.zip = function () {
    var args = $A(arguments);
    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return collections.pluck(index);
    });
  }

  Array.prototype.pluck = function(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  };

  Array.prototype.include = function(pattern) {
    return this.indexOf(pattern) > -1;
  }

  Array.prototype.last = Array.prototype.peek;
  Array.prototype.each = Array.prototype.forEach;

  function $A(iterable) {
    if (!iterable) return [];
    if ('toArray' in Object(iterable)) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  }

  $.toTagName = function(type) {
    return type[0].toLowerCase() + type.substring(1).gsub(/([A-Z])/, function(match) {
      return '_' + match[0].toLowerCase();
    });
  };

  $node = function(type, children, childNames) {
    type = $.toTagName(type);

    children = children || [];
    childNames = childNames || [];

    var node = $('<' + type + '>');
    var merged = children.zip(childNames);

    merged.each(function(childAndName, i) {
      if (childAndName[0] instanceof Token) {
        childAndName[0] = $token(childAndName[0]);
      }

      if (!childAndName[0]) return;

      childAndName[0] = childAndName[0].clone();

      if (childAndName[1]) {
        childAndName[0].attr('class', childAndName[1]);
      }

      childAndName[0].appendTo(node);

    }.bind(this));

    return node;
  };

  $statement = function(node) {
    return $node('terminated_statement', [node], ['statement']);
  };

  $variable = function(name, value) {
    var declaration = value ? $node('variable_declaration', [
      name,
      value
    ], [
      'name',
      'value'
    ]) : $node('variable_declaration', [
      name,
      value
    ], [
      'name',
      'value'
    ]);

    return $statement(
      $node('variable_statement', [
        $node('variable_declaration_list', [
          declaration
        ])
      ])
    );
  };

  $assignment = function(left, right) {
    return $node('assignment_expression', [
      left,
      $node('operator', [Token.ASSIGN]),
      right
    ], [
      'left',
      'operator',
      'right'
    ]);
  };

  $token = function(token) {
    var node = $node('token');
    node.attr('type', token.type);
    node.attr('line', token.line);
    node.text(token.value);

    return node;
  };

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
      var name = methods.initialize && methods.initialize.name;
      if (!name) throw 'Class cannot be created without a name';

      var klass = methods.initialize || function() {};

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

      return klass;
    });
})(jQuery);
