var pave = require('../lib/pavement');

describe('pavement', function() {
  var ref = {};

  it('should compile an empty getter', function() {
    var get = pave();
    console.log('empty');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get(null)).to.equal(null);
    expect(get(false)).to.equal(false);
    expect(get(ref)).to.equal(ref);
  });

  it('should compile a small getter', function() {
    var get = pave('one');
    console.log('small');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get({wan: false})).to.equal(undefined);
    expect(get({one: false})).to.equal(false);
    expect(get({one: 'eight'})).to.equal('eight');
  });

  it('should compile a deep getter', function() {
    var get = pave('one', 'two', 'three');
    console.log('deep');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get({one: null})).to.equal(undefined);
    expect(get({one: false})).to.equal(undefined);
    expect(get({one: {}})).to.equal(undefined);
    expect(get({one: {two: null}})).to.equal(undefined);
    expect(get({one: {two: false}})).to.equal(undefined);
    expect(get({one: {two: {}}})).to.equal(undefined);
    expect(get({one: {two: {three: null}}})).to.equal(null);
    expect(get({one: {two: {three: false}}})).to.equal(false);
    expect(get({one: {two: {three: 'nine'}}})).to.equal('nine');
    expect(get({one: {two: {three: ref}}})).to.equal(ref);
  });

  it('should compile an index getter', function() {
    var get = pave(0);
    console.log('index');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get([])).to.equal(undefined);
    expect(get({length: 4})).to.equal(undefined);
    expect(get([null])).to.equal(null);
    expect(get([false])).to.equal(false);
    expect(get([undefined, true])).to.equal(undefined);
    expect(get(['ten'])).to.equal('ten');
    expect(get([ref])).to.equal(ref);
  });

  it('should compile a deep-index getter', function() {
    var get = pave(0, 1, 2, 3);
    console.log('deep-index');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get([])).to.equal(undefined);
    expect(get({length: 4})).to.equal(undefined);
    expect(get([null])).to.equal(undefined);
    expect(get([false])).to.equal(undefined);
    expect(get([{}])).to.equal(undefined);
    expect(get([[]])).to.equal(undefined);
    expect(get([{length: 3}])).to.equal(undefined);
    expect(get([1, [1, [1, 1, [1, 1, 1, true]]]])).to.equal(undefined);
    expect(get([[1, 1, [1, 1, [1, 1, 1, true]]]])).to.equal(undefined);
    expect(get([[1, [1, 1, 1, [1, 1, 1, true]]]])).to.equal(undefined);
    expect(get([[1, [1, 1, [1, 1, 1, 1, true]]]])).to.equal(1);
    expect(get([[1, [1, 1, [1, 1, 1, true]]]])).to.equal(true);
    expect(get([[1, [1, 1, [1, 1, 1, ref]]]])).to.equal(ref);
  });

  it('should compile a deep-aa getter', function() {
    var get = pave('one', 2, 'three', 4, 'five');
    console.log('deep-aa');
    console.log(get + '');
    expect(get({one: [1, 1, {three: [1, 1, 1, 1, {five: ref}]}]})).to.equal(ref);
  });

  it('should compile a deep-ab getter', function() {
    var get = pave('one', 2, 'three', 4);
    console.log('deep-ab');
    console.log(get + '');
    expect(get({one: [1, 1, {three: [1, 1, 1, 1, ref]}]})).to.equal(ref);
  });

  it('should compile a deep-ba getter', function() {
    var get = pave(0, 'one', 2, 'three', 4, 'five');
    console.log('deep-ba');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get([])).to.equal(undefined);
    expect(get({length: 4})).to.equal(undefined);
    expect(get([{one: [1, 1, {three: [1, 1, 1, 1, {five: ref}]}]}])).to.equal(ref);
  });

  it('should compile a deep-bb getter', function() {
    var get = pave(0, 'one', 2, 'three', 4);
    console.log('deep-bb');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get([])).to.equal(undefined);
    expect(get({length: 4})).to.equal(undefined);
    expect(get([{one: [1, 1, {three: [1, 1, 1, 1, ref]}]}])).to.equal(ref);
  });

  it('should compile a complex getter', function() {
    var get = pave('one', -1, 'two', 'three', 4, -1, 5, 'seven');
    console.log('complex');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get({one: [{two: {three: [1, 1, 1, 1, [[1, 1, 1, 1, 1, {seven: ref}]]]}}]})).to.equal(ref);
    expect(get({one: [1, {two: {three: [1, 1, 1, 1, [[1, 1, 1, 1, 1, {seven: ref}]]]}}]})).to.equal(ref);
    expect(get({one: [{two: {three: [1, 1, 1, 1, [1, [1, 1, 1, 1, 1, {seven: ref}]]]}}]})).to.equal(ref);
    expect(get({one: [1, {two: {three: [1, 1, 1, 1, [1, [1, 1, 1, 1, 1, {seven: ref}]]]}}]})).to.equal(ref);
  });

  it('should compile a deep-loop getter', function() {
    var get = pave(-1, -1, 'one');
    console.log('deep-loop');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get([[{one: ref}]])).to.equal(ref);
    expect(get([[{two: 1}, {one: ref}]])).to.equal(ref);
    expect(get([{two: 1}, [{one: ref}]])).to.equal(ref);
    expect(get([{two: 1}, [{three: 1}, {one: ref}]])).to.equal(ref);
  });

  it('should compile a deeper-loop getter', function() {
    var get = pave(-1, -1, -1, 'one');
    console.log('deeper-loop');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get([[[{one: ref}]]])).to.equal(ref);
    expect(get([[[,,],[,,],[,,]],[[,,],[,,],[,,]],[[,,],[,,],[,,]]])).to.equal(undefined);
    expect(get([[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]]])).to.equal(undefined);
    expect(get([[[{},{},{}],[{},{},{}],[{},{one: ref},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]]])).to.equal(ref);
    expect(get([[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{one: ref},{}],[{},{},{}]]])).to.equal(ref);
  });

  it('should compile a special getter', function() {
    var get = pave('one', -1);
    console.log('special');
    console.log(get + '');
    expect(get()).to.equal(undefined);
    expect(get({})).to.equal(undefined);
    expect(get({one: [ref]})).to.equal(ref);
    expect(get({one: [false, true]})).to.equal(false);
  });
});
