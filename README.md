Files-io
========

Read many files with node

# Install

`npm i files-io --save`

# How to use?

```js
const files = require('files-io');

files.read(['README.md', 'package.json'], 'utf8', (error, allData) => {
    console.log(error, allData);
});


/* Easy way to create pipe which would handle all error events and redirect tham to callback. */
const NameFrom = 'README.md';
const NameTo = 'README_COPY.gz';
    
const options = {
    gzip: true
};

files.pipe(NameFrom, NameTo, options, (error) => {
    console.log(error || 'done');
});

/* join couple files and save them to new file with streams */
const fs = require('fs');
const NAME = 'Join';
const writeStream = fs.createWriteStream(NAME);

files.readPipe(['README.md', 'package.json'], writeStream, (error) => {
    if (error)
        console.log(error.message);
});
```

# License

MIT

