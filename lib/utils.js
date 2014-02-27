exports.pluck = pluck;
exports.identity = identity;
exports.flatten = flatten;

var hasOwn = Object.prototype.hasOwnProperty;
var forEach = Array.prototype.forEach;

function pluck(array, key) {
  var values = new Array(array.length);
  for (var i = array.length - 1; i >= 0; i--) {
    values[i] = array[i][key];
  }
  return values;
}

function identity(value) {
  return value;
}

// adapted from underscore.js
function _flatten(input, output) {
  forEach.call(input, function(value) {
    if (value && (Array.isArray(value) || hasOwn.call(value, 'callee'))) {
      _flatten(value, output);
    } else {
      output.push(value);
    }
  });
  return output;
}

// flattens the array
function flatten(array) {
  return _flatten(array, []);
}
