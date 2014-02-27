// yeah ok so this isn't really tokenizing...
function tokenize(parts) {
  var i, n, varOpts, tokens, last, lastToken, lastMatch, value;
  parts = parts.slice(); // so we don't mess up the provided array
  varOpts = {
    loop: false,
    deepLoop: false, // array of loop indicies
    has: false
  }
  n = parts.length;
  // if we don't have any parts, we're home free
  if (!n) {
    return {
      varOpts: varOpts,
      tokens: []
    };
  }
  last = parts[n - 1];
  // !(a >= 0) is not the same as a < 0 because a isn't limited to real numbers
  if (last === +last && !(last >= 0)) {
    // ensure we're not searching for the impossible
    parts[n - 1] = 0;
  }
  last = null;
  lastToken = null;
  tokens = [];
  for (i = 0; i < n; i++) {
    if (parts[i] === +parts[i]) {
      if (parts[i] >= 0) {
        // index lookup
        value = {
          value: parts[i],
          at: 'index'
        };
        if (last === 'look') {
          // add to previous lookup token
          lastToken.values.push(value);
        } else {
          // create new lookup token and link to previous match token
          lastToken = {
            type: 'look',
            values: [value]
          };
          if (last === 'match') {
            lastMatch.next = lastToken;
          } // else should mean this is the first token
          tokens.push(lastToken);
        }
        last = 'look';
      } else {
        // first that matches
        // set loop flag
        varOpts.loop = true;
        // create new match token and link to previous match token
        lastToken = {
          type: 'match',
          next: null,
          terminal: false
        };
        if (last === 'match') {
          // set deepLoop flag for nested loops
          varOpts.deepLoop = true;
          lastMatch.next = lastToken;
        } else {
          tokens.push(lastToken);
        }
        lastMatch = lastToken;
        last = 'match';
      }
    } else {
      // property lookup
      if (last === 'match') {
        varOpts.has = true;
      }
      value = {
        value: parts[i],
        at: 'prop'
      };
      if (last === 'look') {
        // add to previous lookup token
        lastToken.values.push(value);
      } else {
        // create new lookup token and link to previous match token
        lastToken = {
          type: 'look',
          values: [value]
        };
        if (last === 'match') {
          lastMatch.next = lastToken;
        } // else should mean this is the first token
        tokens.push(lastToken);
      }
      last = 'look';
    }
  }
  // force the last match to terminate on the last token
  if (lastMatch) { // if (last === 'match') {
    lastMatch.terminal = true;
    tokens.pop();
  }
  return {
    varOpts: varOpts,
    tokens: tokens
  };
}

module.exports = tokenize;
