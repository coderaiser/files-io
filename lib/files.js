'use strict';

const {promisify} = require('util');
const fs = require('fs');
const zlib = require('zlib');
const assert = require('assert');

const pipe = promisify(require('pipe-io'));
const {assign} = Object;
const readFile = promisify(fs.readFile);

module.exports.read = async (files, options) => {
    const filesData = {};
    
    assert(files, 'files could not be empty!');
    
    for (const name of files) {
        const data = await readFile(name, options);
        filesData[name] = data;
    }
    
    return filesData;
};

module.exports.readPipe = async function readPipe(names, write, options = {gzip: false}) {
    const {length} = names;
    
    if (!length)
        return write.end();
    
    const [name] = names;
    
    const opt = {
        ...options,
        end: false,
    };
    
    await pipeFiles(name, write, opt);
    await readPipe(names.slice(1), write, opt);
};

module.exports.pipe = pipeFiles;

async function pipeFiles(read, write, options = {}) {
    const isStrRead = typeof read === 'string';
    const isStrWrite = typeof write === 'string';
    const optionsRead = {
        bufferSize: 4 * 1024
    };
    
    assert(read, 'read could not be empty!');
    assert(write, 'write could not be empty!');
    
    const {
        range,
        gzip,
        gunzip,
    } = options;
    
    if (range)
        assign(optionsRead, {
            start: range.start,
            end: range.end,
        });
    
    if (isStrRead)
        read = fs.createReadStream(read, optionsRead);
    
    if (isStrWrite)
        write = fs.createWriteStream(write);
    
    let zip;
    let streams = [];
    
    if (!gzip && !gunzip) {
        streams = [read, write];
    } else {
        if (gzip)
            zip = zlib.createGzip();
        else
            zip = zlib.createGunzip();
        
        streams = [read, zip, write];
    }
    
    await pipe(streams, options);
}

