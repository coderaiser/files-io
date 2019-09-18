'use strict';

const fs = require('fs');
const os = require('os');
const {join} = require('path');

const tryToCatch = require('try-to-catch');
const test = require('supertape');
const files = require('..');

test('files: read', async (t) => {
    const dir = join(__dirname, '..');
    const names = [
        `${dir}/package.json`,
        `${dir}/README.md`,
    ];
    
    const result = await files.read(names);
    
    const expected = {
        [`${dir}/package.json`]: fs.readFileSync(`${dir}/package.json`),
        [`${dir}/README.md`]: fs.readFileSync(`${dir}/README.md`),
    };
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('files: pipe', async (t) => {
    const tmpDir = os.tmpdir();
    const from = join(__dirname, '..', 'README.md');
    const to = join(tmpDir, 'README_COPY.gz');
    
    const [e] = await tryToCatch(files.pipe, from, to);
    
    fs.unlinkSync(to);
    
    t.notOk(e, 'should not be error');
    t.end();
});

test('files: pipe: gzip', async (t) => {
    const tmpDir = os.tmpdir();
    const from = join(__dirname, '..', 'README.md');
    const to = join(tmpDir, 'README_COPY.gz');
    
    const [e] = await tryToCatch(files.pipe, from, to, {
        gzip: true,
    });
    
    fs.unlinkSync(to);
    
    t.notOk(e, 'should not be error');
    t.end();
});

test('files: pipe: gunzip', async (t) => {
    const tmpDir = os.tmpdir();
    const from = join(__dirname, '..', 'README.md');
    const to = join(tmpDir, 'README_COPY.gz');
    
    const [e] = await tryToCatch(files.pipe, from, to, {
        gunzip: true,
    });
    
    t.ok(e, 'should be error');
    t.end();
});

test('files: pipe: range', async (t) => {
    const tmpDir = os.tmpdir();
    const from = join(__dirname, '..', 'README.md');
    const to = join(tmpDir, 'README_COPY.gz');
    
    const [e] = await tryToCatch(files.pipe, from, to, {
        gzip: true,
        range: {
            start: 0,
            end: 10,
        },
    });
    
    fs.unlinkSync(to);
    
    t.notOk(e, 'should not be error');
    t.end();
});

test('files: pipe: streams', async (t) => {
    const tmpDir = os.tmpdir();
    const from = join(__dirname, '..', 'README.md');
    const to = join(tmpDir, 'README_COPY.gz');
    const fromStream = fs.createReadStream(from);
    const toStream = fs.createWriteStream(to);
    
    const [e] = await tryToCatch(files.pipe, fromStream, toStream);
    
    fs.unlinkSync(to);
    
    t.notOk(e, 'should not be error');
    t.end();
});

test('files: readPipe', async (t) => {
    const tmpDir = os.tmpdir();
    const file1 = join(__dirname, '..', 'README.md');
    const file2 = join(__dirname, '..', 'package.json');
    const to = join(tmpDir, 'README_COPY.gz');
    const stream = fs.createWriteStream(to);
    
    const [e] = await tryToCatch(files.readPipe, [file1, file2], stream);
    
    fs.unlinkSync(to);
    
    t.notOk(e, 'should not be error');
    t.end();
});

