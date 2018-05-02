'use strict';

const fs = require('fs');
const zlib = require('zlib');
const pipe = require('pipe-io/legacy');
const extendy = require('extendy');
const assert = require('assert');
const type = require('itype/legacy');

module.exports.read = (files, options, callback) => {
    let done        = [],
        isDone      = false,
        noOptions   = type.function(options),
        readFiles   = {},
        doneFunc    = function (name, error, data) {
            done.pop();
            
            if (error) 
                done = [];
            else
                readFiles[name] = data;
            
            if (!done.length && !isDone) {
                isDone  = true;
                callback(error, readFiles);
            }
        };
    
    if (noOptions) {
        callback   = options;
        options    = null;
    }
    
    assert(files, 'files could not be empty!');
    assert(callback, 'callback could not be empty!');
    
    done = files.map(function(name) {
        fs.readFile(name, options, doneFunc.bind(null, name));
        return name;
    });
};

module.exports.readPipe = function readPipe(names, write, options, callback) {
    let name, lenght;
    
    if (!callback) {
        callback    = options;
        options     = {
            gzip    : false
        };
    }
    
    options.end  = false;
    
    if (names) {
        lenght  = names.length;
        names   = names.slice();
    }
    
    if (!lenght) {
        write.end();
        callback();
    } else {
        name = names.shift();
        
        pipeFiles(name, write, options, (error) => {
            if (error)
                return callback(error);
            
            readPipe(names, write, options, callback);
        });
    }
};

/**
 * create pipe
 * 
 * @param read     - readable stream
 * @param write    - writable stream
 * 
 * @param options {
 *      gzip
 *      ungzip
 *      notEnd
 * }
 * 
 * @param callback - function(error) {}
 */
module.exports.pipe = pipeFiles;

function pipeFiles(read, write, options, callback) {
    let gzip,
        streams         = [],
        isStrRead       = type.string(read),
        isStrWrite      = type.string(write),
        isFunc          = type.function(options),
        o               = {},
        optionsRead     = {
            bufferSize: 4 * 1024
        };
    
    if (isFunc)
        callback    = options;
    else 
        o           = options;
    
    assert(read, 'read could not be empty!');
    assert(write, 'write could not be empty!');
    assert(callback, 'callback could not be empty!');
    
    if (options.range)
        extendy(optionsRead, {
            start   : o.range.start,
            end     : o.range.end,
        });
    
    if (isStrRead)
        read        = fs.createReadStream(read, optionsRead);
    
    if (isStrWrite)
        write       = fs.createWriteStream(write);
    
    if (!o.gzip && !o.gunzip) {
        streams     = [read, write];
    }else {
        if (o.gzip)
            gzip    = zlib.createGzip();
        else
            gzip    = zlib.createGunzip();
        
        streams     = [read, gzip, write];
    }
    
    pipe(streams, options, callback);
}

