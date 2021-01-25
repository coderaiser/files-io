'use strict';

const {run} = require('madrun');

module.exports = {
    'fix:lint': () => run('lint', '--fix'),
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'lint:test': () => 'putout -c .putoutrc.test test',
    'test': () => 'tape test/*.js',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
};

