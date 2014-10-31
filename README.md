Files-io
========

Read many files with node

# Install

`npm i files-io --save`

# How to use?

In node:

```js
var files = require('files-io');

files.read(['README.md', 'package.json'], 'utf8', function(error, data) {
    console.log(error, data);
});
```

# License

MIT
