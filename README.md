Files-io
========

Read many files with node.

# Install

`npm i files-io --save`

# How to use?

```js
const files = require('files-io');

const allData = await files.read(['README.md', 'package.json'], 'utf8');
console.log(allData);

/* Easy way to create pipe which would handle all error events */
const NameFrom = 'README.md';
const NameTo = 'README_COPY.gz';

await files.pipe(NameFrom, NameTo, {
    gzip: true
})
/* join couple files and save them to new file with streams */
const fs = require('fs');
const NAME = 'Join';
const writeStream = fs.createWriteStream(NAME);

await files.readPipe(['README.md', 'package.json'], writeStream);
```

# License

MIT

