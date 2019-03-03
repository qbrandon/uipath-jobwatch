// Centralize logs for easy swap to something more feature rich (e.g. log4js)
'use strict';

/** @enum string */
var LOG_PREFIXES = {
    TRACE: '[TRACE] ',
    INFO:  '[INFO]  ',
    ERROR: '[ERROR] '
};

/** @param {string} msg */
module.exports.trace = function (msg) {
    console.log(LOG_PREFIXES.TRACE + msg);
};

/** @param {string} msg */
module.exports.info = function (msg) {
    console.log(LOG_PREFIXES.INFO + msg);
};

/** @param {string} msg */
module.exports.err = function (msg) {
    console.error(LOG_PREFIXES.ERROR + msg);
};
