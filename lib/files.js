'use strict';

var fs          = require('fs'),
    zlib        = require('zlib'),
    
    pipe        = require('pipe-io/legacy'),
    extendy     = require('extendy'),
    assert      = require('assert'),
    type        = require('itype');

module.exports.read     = function(files, options, callback) {
    var done        = [],
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
    var name, lenght;
    
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
        
        pipeFiles(name, write, options, function(error) {
            if (error)
                callback(error);
            else
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
    var gzip,
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

