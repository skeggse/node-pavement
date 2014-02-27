var tokenize = require('./tokenizer');
var compile = require('./compiler');
var utils = require('./utils');

function pave() {
  var parts = utils.flatten(arguments);
  var obj = tokenize(parts);
  return compile(obj.varOpts, obj.tokens);
}

module.exports = pave;
