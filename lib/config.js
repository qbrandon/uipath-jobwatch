'use strict';

// native
var path = require('path');

// local
var logger = require('./simpleLogger');

/**
 * @param {string} filename
 * @returns {*}
 */
function tryRequireConfig(filename) {
    var config;
    try {
        config = require(path.join('..', 'config', filename));
        logger.trace('Successfully read config file: ' + filename);
    } catch (exception) {
        config = undefined;
    }
    return config;
}

module.exports.getConfig = function () {
    /** @type {string|undefined} */
    var environment = process.env.NODE_ENV;
    /** @type {*} */
    var output;

    if (environment !== undefined) {
        output = tryRequireConfig(environment);
    }
    if (output === undefined) {
        output = tryRequireConfig('default');
    }
    return output;
};
