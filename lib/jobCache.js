'use strict';

var CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
var EXPIRY_PERIOD = 6 * 3600 * 1000; // 6 hours

/** @type {Object} */
var cache = {};

/**
 * @param {number} faultedJobId
 * @returns {number}
 */
module.exports.getFailureCount = function (faultedJobId) {
    var current = cache[faultedJobId];
    if (current === undefined) {
        return 0;
    }
    return current.count;
};

/**
 * @param {number} faultedJobId
 * @param {number} newJobId
 */
module.exports.updateFailure = function (faultedJobId, newJobId) {
    var count;
    var faultedJob = cache[faultedJobId];

    if (faultedJob === undefined) {
        count = 0;
    } else {
        count = faultedJob.count;
        delete cache[faultedJobId]; // I know, slow object
    }
    cache[newJobId] = {
        count: count + 1,
        timestamp: Date.now()
    };
};

// Background cache cleanup
setInterval(function () {
    var i, len;
    var keys = Object.keys(cache);
    var currentKey;
    var expiry = Date.now() - EXPIRY_PERIOD;

    for (i = 0, len = keys.length; i< len; i += 1) {
        currentKey = keys[i];
        if (cache[currentKey].timestamp < expiry) {
            delete cache[currentKey];
        }
    }
}, CLEANUP_INTERVAL);
