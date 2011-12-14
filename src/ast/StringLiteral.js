function StringLiteral(stringLiteral) {
  this.interpolation = this.interpolate(stringLiteral);
};

StringLiteral.prototype.interpolate = function(stringLiteral) {
  var escaped = false;
  var openBraces = 0;
  var output = [];
  var code = [];

  stringLiteral = stringLiteral.substring(1, stringLiteral.length - 1);

  for (var i = 0, len = stringLiteral.length; i < len; ++i) {
    i = 0;
    len = stringLiteral.length;
    escaped = false;
    openBraces = 0;
    code = [];

    var interpolation = stringLiteral.match(/#\{/);
    if (!interpolation) {
      console.log(stringLiteral);
      stringLiteral.length && output.push(stringLiteral);
      break;
    }

    for (var j = startIndex - 1; j >= 0; --j) {
      if (stringLiteral[j] === '\\') {
        escaped = !escaped
      } else {
        escaped = false;
        break;
      }
    }

    if (escaped) continue;

    openBraces = 1;
    var startIndex = stringLiteral.indexOf(interpolation);

    // Push all the string up to the interpolated part.
    output.push(stringLiteral.substring(i, startIndex));

    for (var j = startIndex + 2; j < len; ++j) {
      if (stringLiteral[j] === '{') openBraces++;
      if (stringLiteral[j] === '}') openBraces--;

      // Check to see if we have balenced the braces
      if (!openBraces) break;

      code.push(stringLiteral[j]);
    }

    // If there are still open braces, we hit the end of the string while parsing.
    if (openBraces) throw new Error('Reached end of string while parsing interpolation: ' + stringLiteral.replace('\\', '\\\\'));

    output.push({
      code: code.join('')
    });

    stringLiteral = stringLiteral.substring(j + 1);
  }

  return output;
};

StringLiteral.prototype.compile = function() {
  // If there was only 1 string there was no interpolated code
  if (this.interpolation.length === 1) {
    compiler.out(['"', this.interpolation[0], '"'].join(''));
    return;
  }

  // We should have a way to error check the code in their, but not now...
  var str = [];
  for (var i = 0, len = this.interpolation.length; i < len; ++i) {
    str.push(this.interpolation[i].code || ['"', this.interpolation[i], '"'].join(''));
  }

  var list = new ElementList();
  list.elements = str;

  compiler.out(new ArrayLiteral(list));
  compiler.out('.join("")');
};
