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
