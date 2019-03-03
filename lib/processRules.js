'use strict';

// native
var fs = require('fs');

// 3rd party
var csvParse = require('csv-parse');

// local
var logger = require('./simpleLogger');

/** @type {Array.<Object.<string>>} */
var rules;
/** @type {Object.<Object.<string>>} */
var processMap = {};

/**
 * @param {string} path
 * @param {function(Error|undefined=, Array.<Object.<string>>=)} cb
 */
function tryReadCsv(path, cb) {
    fs.readFile(
        path,
        /**
         * @param {Error} err
         * @param {string} data
         */
        function (err, data) {
            if (err) {
                cb(err);
                return;
            }
            csvParse(data, function (err, rows) {
                var i, j, len;
                /** @type {Array.<string>} */
                var headers;
                /** @type {Array.<string>} */
                var row;
                /** @type {Object.<string>} */
                var current;
                /** @type {Array.<Object>} */
                var output = [];

                if (err) {
                    cb(err);
                    return;
                }
                headers = rows[0];
                for (i = 1, len = rows.length; i < len; i += 1) {
                    row = rows[i];
                    current = {};
                    for (j = 0; j < row.length && j < headers.length; j += 1) {
                        current[headers[j]] = row[j];
                    }
                    output.push(current);
                }
                cb(undefined, output);
            });
        }
    );
}

/**
 * @param {string} path
 * @param {function(Error=)} cb
 */
module.exports.setup = function (path, cb) {
    tryReadCsv(path, function (err, data) {
        var i, len;
        /** @type {Array.<string>} */
        var processNames;

        if (err) {
            cb(err);
            return;
        }
        if (!data) {
            cb(new Error('Rule set is empty'));
            return;
        }
        rules = data;
        for (i = 0, len = rules.length; i < len; i += 1) {
            if (rules[i].name) {
                processMap[rules[i].name] = rules[i];
            }
        }
        processNames = Object.keys(processMap);
        if (processNames.length === 0) {
            cb(new Error('Rule set is empty'));
            return;
        }
        logger.trace('Monitoring processes: ' + processNames);
        cb();
    });
};

/**
 * @param {string} process
 * @returns {Object.<string>|undefined}
 */
module.exports.getRules = function (process) {
    return processMap[process];
};
