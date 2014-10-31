Files-io
========

Read many files with node

# Install

`npm i files-io --save`

# How to use?

In node:

```js
var files = require('files-io');

files.read(['README.md', 'package.json'], 'utf8', function(error, read, pack) {
    console.log(error, read, pack);
});

/* join couple files and save them to new file with streams */
var fs          = require('fs'),
    NAME        = 'Join',
    writeStream = fs.createWriteStream(NAME);

files.readPipe(['README.md', 'package.json'], writeStream, function(error) {
    if (error)
        console.log(error.message);
});
```

# License

MIT
