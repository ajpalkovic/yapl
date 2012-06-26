function doIt() {
  var something = ['foo', 'bar', 'bash'];
  something[3] = 'baz';
  something[4] = 2;

  for (var i = 0; i < something.length; ++i) {
    (function (i) {
      window.setTimeout(function() {
        console.log(i, ' ', something[i]);
      }, 10000);
    })(i);
  }
}

(function() { return 1; } || function () { return 2; })();


x = [0];
x = (x || []);
x[0] = 'hi';
