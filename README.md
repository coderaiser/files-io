Files-io
========

Read many files with node

# Install

`npm i files-io --save`

# How to use?

```js
var files = require('files-io');

files.read(['README.md', 'package.json'], 'utf8', function(error, allData) {
    console.log(error, allData);
});


/* Easy way to create pipe which would handle all error events and redirect tham to callback. */
var NameFrom    = 'README.md',
    NameTo      = 'README_COPY.gz',
    
    options     = {
        gzip: true
    };

files.pipe(NameFrom, NameTo, options, function(error) {
    var msg = 'done';
    
    console.log(error || msg);
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
