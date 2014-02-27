node-pavement
=============

[![Build Status](https://travis-ci.org/skeggse/node-pavement.png)](https://travis-ci.org/skeggse/node-pavement)

Pavement creates a getter function for specific use-cases. If an API returns a massive object and the value you want is deep within the structure, the generated function will efficiently get the value.

API
===

### pave(...path)

Pave a path.

```js
var object = {
  format: {},
  tokens: [],
  result: {
    // corridors doesn't have a predefined order
    corridors: [{
      left: 7
    }, {
      // create a getter for the value 4
      right: 4
    }, {
      top: 3
    }]
  }
};

var get = pave('result', 'corridors', -1, 'right');

get(object) // => 4

object.result.corridors.unshift({
  bottom: ['one']
});

get(object) // => 4

get({}) // => undefined
```

License
=======

> The MIT License (MIT)

> Copyright &copy; 2014 GlobeSherpa

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
