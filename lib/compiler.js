var utils = require('./utils');
var rIdentifier = /^[a-z\$][a-z0-9\$]*$/i;

function plain(name) {
  if (name === +name) {
    return name + '';
  }
  return '[' + JSON.stringify(name) + ']';
}

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

function checker(part, next) {
  var body = 'if (' + part + ' && ';
  if (next.at === 'prop') {
    body += 'hasOwn.call(' + part + ', ' + plain(next.value) + ')';
  } else {
    body += part + '.length > ' + plain(next.value);
  }
  return body + ') {\n';
}

function yielder(terminal, part, node) {
  var body = '', values = node.values;
  if (values.length === 1) {
    body += terminal ? 'return ' : 'value = ';
    body += part + getter(values[0].value) + ';\n';
  } else {
    body += 'value = ' + part + ';\n';
    if (terminal) {
      values = utils.pluck(values, 'value');
      body += 'return ' + fullGetter('value', values) + ';\n';
    }
  }
  if (!terminal) {
    body += 'break;\n';
  }
  return body;
}

// compile a tree of match tokens into a nest
function nest(tree) {
  var body = '', depth = 0, offset = 'value[i]', last = null;
  for (var node = tree; node; last = node, node = node.next) {
    if (node.type === 'match') {
      body += 'if (!' + offset + ' || !' + offset + '.length) continue;\n';
      body += 'for (index[' + depth + '] = 0; index[' + depth + '] < ' + offset + '.length; index[' + depth + ']++) {\n';
      offset += '[index[' + depth + ']]';
      depth++;
    } else {
      body += checker(offset, node.values[0]);
      body += yielder(last.terminal, offset, node);
      body += '}\n';
    }
  }
  body = 'index = new Array(' + depth + ');\n' + body;
  while (depth--) {
    body += '}\n';
  }
  return body;
}

// compile to source
function compile(varOpts, tokens) {
  var i, n, token, body, vars, setHas, next, nextValue;
  if (!tokens.length) {
    return utils.identity;
  }
  vars = [];
  varOpts.loop && vars.push('i, n');
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
  for (i = 0, n = tokens.length; i < n; i++) {
    token = tokens[i];
    next = token.next;
    switch (token.type) {
    case 'look':
      body += 'value = ' + fullGetter('value', utils.pluck(token.values, 'value')) + ';\n';
      break;
    case 'match':
      body += 'if (!value || !value.length) return;\n';
      nextValue = next.type === 'look' && next.values[0];
      if (!setHas && nextValue && nextValue.at === 'prop') {
        body += 'hasOwn = Object.prototype.hasOwnProperty;\n';
        setHas = true;
      }
      body += 'for (i = 0, n = value.length; i < n; i++) {\n';
      if (token.next.type === 'look') {
        body += checker('value[i]', nextValue);
        body += yielder(token.terminal, 'value[i]', next);
        body += '}\n';
      } else if (token.next.type === 'match') {
        // TODO: optimize
        if (!setHas) {
          body += 'hasOwn = Object.prototype.hasOwnProperty;\n';
          setHas = true;
        }
        body += nest(next);
      }
      body += '}\n';
      break;
    default:
      throw new TypeError('unknown token ' + tokens[i].type);
    }
  }
  return new Function('value', body);
}

module.exports = compile;
