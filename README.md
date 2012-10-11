# Yet Another Programming Language

Yapl (Yet Another Programming Language) is a new language that aims to simplify/transform the syntax of JavaScript
to a more Ruby-like experience, while preserving JavaScript's powerful semantic concepts.  Ultimately, Yapl will compile to ECMA-262 compliant JavaScript, and could be used in either browser clients or on the server via frameworks such as Node.js.

The syntax resembles a hybrid of Ruby and JavaScript, preferring Ruby's terse and clean approach to formatting and
expressiveness and JavaScript's powerful semantic concepts.  Yapl also introduces a simple Object-Oriented/Class-based system that replaces the need to roll a third-party or custom Prototypal inheritance implementation, such those found in Prototype.js and JQuery.

I will be primarily developing this language for a class project, but I hope to continue developing it in the future.

## Development Log
### 9-16-2012
I broke out the old code and started to fix some quirky bugs and fix the remaining AST parser actions.  The parser seems
to work just fine, but there are some inherent nasty ambiguities in the language.

For example: consider the following code

    foo bar(1)[1, 2], 3, 4

Even though Yapl supports paren-less function calls, you might intuitively guess that the previous code would not parse
successfully. In actuality, Yapl would parse it like this:

    foo(bar(1)([1, 2], 3, 4))

Ruby does not have the notion of first-class functions, so it does not run into these types of ambiguities.
JavaScript and Yapl however support first-class functions, so there is an inherent ambiguity when the return value of
a function is another function, as is case with the above example.  I will have to assess whether or not the
utility of paren-less function calls outweighs the awkward ambiguities.

### 9-17-2012
I fixed a couple more bugs in the parser and lexer:
  - if a parser rule captured the value of a terminal, but at that position in the lexer there was an optional
    terminal (such as a \n), then it would capture the value of that optional token, as opposed to ignoring it.
  - the first character of a regular expression literal must not be a space character
    - I should probably make that more extensible to any whitespace character.

### 9-18-2012
I decided to remove the explicit keyword-argument syntax from the language.  Instead of the following:

    function foo(first, second, third='there')
      ...
    end

    foo first, second, third:'hello'

there is no special syntax for keyword arguments.  If one of the parameters has an assignment expression
like this:

    foo first, second, third='hello'

the assigned variable `third` corresponds to the formal parameter.  In the case where there is another variable
in the scope of the function call with the same name as the formal parameter, that variable does not receive
the assignment:

    third = '3'
    foo first, second, third='hello'
    third // '3'

I decided to take this route after looking into how Python handles this particular case.  The following code snippet
shows that Python takes a similar approach:

    >>> def test(arg='hi'):
    ...   pass
    ...
    >>> arg = 'hello'
    >>> test(arg = 'there')
    >>> arg
    'hello'
    >>>

### 10-1-2012
Today I chatted a bit with AJ about some of the downsides of writing JavaScript.  I expressed my frustration with many of JavaScript's
well-known flaws, such as lack of library support, a module system for organizing code, etc.  While talking, I also expressed my displeasure
with the fact that if an application wants to use Object-Oriented design in a class-based system, constructing the hierarchy properly in
JavaScript's prototype model requires each developer to write their own 'class creation function', or use existing implementations, such
as the one found in Prototype.js.

One of the current problems we discussed with Prototype's class-creation implementation is that all resulting objects are instances of the
type 'klass'.  If we take a look at the generic implementation, we can see why:

    makeClass(parent, methods) {
      function klass() {
        this.initialize.apply(this, arguments);
      }

      if (parent) {
        var subclass = function() { };
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
    }

The issue is that this common implementation wraps the "constructor" function of the class in another function to correctly set up the prototype of the class. The `makeClass`
function returns this wrapper function, and when a new object is created, JavaScript uses the name of the callee constructor function (in this case 'klass')
as the 'class name'.  While JavaScript has no notion of class names, the idea of having the correct name for an object is crucial for debugging, as
the developer console will show the name of the constructor function ('klass') as the 'type' (not in the JavaScript sense) of the object.  Like so:

    >>> function MyClass() {}
    >>> var instance = new MyClass();
    >>> instance
    MyClass
    >>>

I decided to takle this common problem by relying on named function-expressions for the initialize/constructor function of the class:

    >>> var MyClass = makeClass({
    >>>     initialize: function MyClass() {}
    >>> });
    >>>
    >>> var x = new MyClass();
    >>> x
    klass

But this is not enough, as the `function MyClass` is actually wrapped by the `function klass`, as we discussed earlier.  I needed to essentially create a function at runtime
with the same name as the function expression in the `initialize` key.  To do this, I used a lot of hackery:

    Function.create = function(name, arguments, body) {
      return eval('(function ' + name + '(' + arguments + ') {' + body + '})');
    };

    function(namespace, parent, methods) {
      var name = methods.initialize ? methods.initialize.name : 'klass';
      var klass = Function.create(name, [], 'this.initialize.apply(this, arguments);');

      namespace[name] = klass;

      if (parent) {
        var subclass = function() { };
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
    }

This method is kind-of gross, but it works.  It allows the user to create classes with properly-named constructor functions.  I also added the capability to add the class
to a namespace object, and overloaded the function with the simple overload function I wrote to produce this:

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
        var subclass = function() { };
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

In action:

    >>> klass({
    >>>   initialize: function MyClass() {}
    >>> });
    >>>
    >>> var instance = new MyClass();
    >>> instance
    MyClass

### 10-2-12 through 10-9-12
I did a lot over the last week, probably too much to go into in detail.  Here is a quick summary:
  - Wrote all of the Parse Tree Nodes
  - Wrote most of the JavaScript compiling methods
  - Fixed some syntax ambiguities (like ConditionalLoad)
  - Rewrote the parser actions
  - Restructured the compiler to be more modular
  - Changed some syntax around
  - Fixed a bug where line numbers were off by one
  - Added some simple Compile errors with accurate line #s

I still need to write another Compiler pass to process symbols and perform static analysis of the
parse tree.

### 10-11-12
Syntax woes.  Paren-less function calls are the bane of my existence; [they create enormous syntax ambiguities
in the language](http://petercai.com/ruby-too-smart-for-its-own-good/, "Ruby Ambiguities").

For example, I was just minding my own business, testing out some basic arithmetic expressions:

    x + 3 - y

when I saw the generated JavaScript:

    x(+3(-y));

Yea... It makes complete sense, but it really makes things more difficult.  So I thought "how does Ruby solve this
particular problem?":

    irb(main):001:0> def x()
    irb(main):002:1>   5
    irb(main):003:1> end
    => nil
    irb(main):004:0> y = 1
    => 1
    irb(main):005:0> x + 3 - 1
    => 7

So Ruby gets the picture, but to be fair, let's add an argument to `x` to see if Ruby thinks `+ 3 - 1` should be
the argument:


    irb(main):001:0> def x(a)
    irb(main):002:1>   5
    irb(main):003:1> end
    => nil
    irb(main):004:0> y = 1
    => 1
    irb(main):005:0> x + 3 - 1
    ArgumentError: wrong number of arguments (0 for 1)
            from (irb):1:in 'x'
            from (irb):5
            from C:/Ruby192/bin/irb:12:in '<main>'

Nope, Ruby still tried to add the return value of `x` to `3`.  So then how is Ruby assuming that the `+ 3 - 1`
shouldn't be parsed as `(+3) - 1`?  The answer:

    irb(main):001:0> def x(a)
    irb(main):002:1>   5
    irb(main):003:1> end
    => nil
    irb(main):004:0> y = 1
    => 1
    irb(main):005:0> x +3 - 1
    => 5

Ruby actually cares about whitespace after unary operators to disambiguate these situations.  I can't enable
optional whitespace tokens in the lexer because it doesn't solve the problem.  If I changed `UnaryExpression` to:

    UnaryExpression: {
      productions: [
        ['UnaryOperator', '!WHITESPACE', 'UnaryExpression'],
        ['IncrementExpression']
      ]
    }

Strings such as `x = + 3` would fail to parse.  Ruby doesn't see a problem with that statement:

    irb(main):009:0> x = + 3
    => 3

So that means the issue of whitespace after unary operators matters in the context of function arguments:

    irb(main):004:0> x+ 3
    ArgumentError: wrong number of arguments (0 for 1)
            from (irb):1:in `x'
            from (irb):4
            from C:/Ruby192/bin/irb:12:in `<main>'

    irb(main):005:0> x+3
    ArgumentError: wrong number of arguments (0 for 1)
            from (irb):1:in `x'
            from (irb):5
            from C:/Ruby192/bin/irb:12:in `<main>'

    irb(main):006:0> x[1]
    ArgumentError: wrong number of arguments (0 for 1)
            from (irb):1:in `x'
            from (irb):6
            from C:/Ruby192/bin/irb:12:in `<main>'

    irb(main):007:0> x [1]
    => 5

So it seems there also has to be whitespace after the function call itself to initiate the call.  Changing
the rule `Call` to:

    Call: {
      productions: [
        ['OPEN_PAREN', 'EmptyList', 'CLOSE_PAREN'],
        ['OPEN_PAREN', 'ArgumentList', 'CLOSE_PAREN'],
        ['WHITESPACE', 'ArgumentList']
      ]
    }

would fix the issues above, but doesn't fix the previous cases.  I think I need to add syntactic predicates
to the parser, which should be an interesting challenge.