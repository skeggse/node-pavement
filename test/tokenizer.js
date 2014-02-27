var tokenize = require('../lib/tokenizer');

describe('tokenize', function() {
  function attempt(value, expected) {
    var result = tokenize(value);
    expect(result).to.eql(expected);
    if (!result.varOpts.loop) {
      expect(result.varOpts.deepLoop).to.not.be.ok;
      expect(result.varOpts.has).to.not.be.ok;
      expect(result.tokens.length).to.be.within(0, 1);
    }
    return result;
  }

  it('should tokenize empty', function() {
    attempt([], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: []
    });
  });

  it('should tokenize small', function() {
    attempt(['one'], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }]
      }]
    });
  });

  it('should tokenize deep', function() {
    attempt(['one', 'two', 'three'], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }, {
          value: 'two',
          at: 'prop'
        }, {
          value: 'three',
          at: 'prop'
        }]
      }]
    });
  });

  it('should tokenize index', function() {
    attempt([0], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 0,
          at: 'index'
        }]
      }]
    });
  });

  it('should tokenize deep-index', function() {
    attempt([0, 1, 2, 3], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 0,
          at: 'index'
        }, {
          value: 1,
          at: 'index'
        }, {
          value: 2,
          at: 'index'
        }, {
          value: 3,
          at: 'index'
        }]
      }]
    });
  });

  it('should tokenize deep-aa', function() {
    attempt(['one', 2, 'three', 4, 'five'], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }, {
          value: 2,
          at: 'index'
        }, {
          value: 'three',
          at: 'prop'
        }, {
          value: 4,
          at: 'index'
        }, {
          value: 'five',
          at: 'prop'
        }]
      }]
    });
  });

  it('should tokenize deep-ab', function() {
    attempt(['one', 2, 'three', 4], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }, {
          value: 2,
          at: 'index'
        }, {
          value: 'three',
          at: 'prop'
        }, {
          value: 4,
          at: 'index'
        }]
      }]
    });
  });

  it('should tokenize deep-ba', function() {
    attempt([0, 'one', 2, 'three', 4, 'five'], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 0,
          at: 'index'
        }, {
          value: 'one',
          at: 'prop'
        }, {
          value: 2,
          at: 'index'
        }, {
          value: 'three',
          at: 'prop'
        }, {
          value: 4,
          at: 'index'
        }, {
          value: 'five',
          at: 'prop'
        }]
      }]
    });
  });

  it('should tokenize deep-bb', function() {
    attempt([0, 'one', 2, 'three', 4], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 0,
          at: 'index'
        }, {
          value: 'one',
          at: 'prop'
        }, {
          value: 2,
          at: 'index'
        }, {
          value: 'three',
          at: 'prop'
        }, {
          value: 4,
          at: 'index'
        }]
      }]
    });
  });

  it('should tokenize complex', function() {
    var result = attempt(['one', -1, 'two', 'three', 4, -1, 5, 'seven'], {
      varOpts: {
        loop: true,
        deepLoop: false,
        has: true
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }]
      }, {
        type: 'match',
        next: {
          type: 'look',
          values: [{
            value: 'two',
            at: 'prop'
          }, {
            value: 'three',
            at: 'prop'
          }, {
            value: 4,
            at: 'index'
          }]
        },
        terminal: false
      }, {
        type: 'look',
        values: [{
          value: 'two',
          at: 'prop'
        }, {
          value: 'three',
          at: 'prop'
        }, {
          value: 4,
          at: 'index'
        }]
      }, {
        type: 'match',
        next: {
          type: 'look',
          values: [{
            value: 5,
            at: 'index'
          }, {
            value: 'seven',
            at: 'prop'
          }]
        },
        terminal: true
      }]
    });

    expect(result.tokens[1].next).to.equal(result.tokens[2]);
  });

  it('should tokenize deep-loop', function() {
    attempt([-1, -1, 'one'], {
      varOpts: {
        loop: true,
        deepLoop: true,
        has: true
      },
      tokens: [{
        type: 'match',
        next: {
          type: 'match',
          next: {
            type: 'look',
            values: [{
              value: 'one',
              at: 'prop'
            }]
          },
          terminal: true
        },
        terminal: false
      }]
    });
  });

  it('should tokenize deeper-loop', function() {
    attempt([-1, -1, -1, 'one'], {
      varOpts: {
        loop: true,
        deepLoop: true,
        has: true
      },
      tokens: [{
        type: 'match',
        next: {
          type: 'match',
          next: {
            type: 'match',
            next: {
              type: 'look',
              values: [{
                value: 'one',
                at: 'prop'
              }]
            },
            terminal: true
          },
          terminal: false
        },
        terminal: false
      }]
    });
  });

  it('should tokenize terminal', function() {
    attempt([-1, 'one'], {
      varOpts: {
        loop: true,
        deepLoop: false,
        has: true
      },
      tokens: [{
        type: 'match',
        next: {
          type: 'look',
          values: [{
            value: 'one',
            at: 'prop'
          }]
        },
        terminal: true
      }]
    });
  });

  it('should tokenize special', function() {
    attempt(['one', -1], {
      varOpts: {
        loop: false,
        deepLoop: false,
        has: false
      },
      tokens: [{
        type: 'look',
        values: [{
          value: 'one',
          at: 'prop'
        }, {
          value: 0,
          at: 'index'
        }]
      }]
    });
  });
});
