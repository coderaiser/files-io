# Files-io [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]
========

[NPMIMGURL]:                https://img.shields.io/npm/v/files-io.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/files-io/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/files-io.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/files-io "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/files-io  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/files-io "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/readify?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/readify/badge.svg?branch=master&service=github

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

