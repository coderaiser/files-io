var files       = require('..'),
    fs          = require('fs'),
    Util        = require('util-io'),
    DIR         = __dirname + '/../',
    NameFrom    = DIR + 'README.md',
    NameTo      = 'README_COPY.gz';
    
    Util.exec.series([
        pipeFile,
        rmFile,
        logResult
    ]);
    
    function pipeFile(callback) {
        var options = {
            gzip    : true
        };
        
        files.pipe(NameFrom, NameTo, options,  function(error) {
            throwIfError(error, callback);
        });
    }
    
    function rmFile(callback) {
        fs.unlink(NameTo, function(error) {
            throwIfError(error, callback);
        });
    }
    
    function logResult() {
        console.log('pipe: OK');
    }
    
    function throwIfError(error, callback) {
        if (error)
            throw(error);
        else
            callback();
    }
