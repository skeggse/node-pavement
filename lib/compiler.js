var utils = require('./utils');
var rIdentifier = /^[a-z\$][a-z0-9\$]*$/i;

function getter(name) {
  if (name === +name) {
    return '[' + name + ']';
  }
  if (rIdentifier.test(name)) {
    return '.' + name;
  }
  return '[' + JSON.stringify(name) + ']';
}

function fullGetter(item, keys) {
  if (!keys.length) {
    return item;
  }
  var items = [item];
  for (var i = 0, n = keys.length - 1; i < n; i++) {
    items.push(item += getter(keys[i]));
  }
  var joined = items.join(' && ');
  joined = items.length > 1 ? ('(' + joined + ')') : joined;
  return '(' + joined + ' || undefined) && ' + item + getter(keys[i]);
}

// compile to source
function compile(varOpts, tokens) {
  var body, vars, setHas;
  if (!tokens.length) {
    return utils.identity;
  }
  vars = [];
  varOpts.loop && vars.push('i, l');
  varOpts.deepLoop && vars.push('index');
  varOpts.has && vars.push('hasOwn');
  if (vars.length) {
    body = 'var ' + vars.join(', ') + ';\n';
  } else {
    // assumes tokens.length === 1 and tokens.type === 'look'
    body = fullGetter('value', utils.pluck(tokens[0].values, 'value'));
    return new Function('value', 'return ' + body + ';\n');
  }
  setHas = false;
  for (var i = 0, n = tokens.length; i < n; i++) {
    switch (tokens[i].type) {
    case 'look':

      break;
    case 'match':
      body += '';
      break;
    default:
      throw new TypeError('unknown token ' + tokens[i].type);
    }
  }
}
