exports.pluck = pluck;
exports.identity = identity;

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
