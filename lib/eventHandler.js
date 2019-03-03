'use strict';

// local
var logger = require('./simpleLogger');
var processRules = require('./processRules');
var orchestratorClient = require('./orchestratorClient');
var jobCache = require('./jobCache');
var mailer = require('./mailer');

/**
 * @param {Object} event
 * @param {Object.<string>} rules
 */
function notify(event, rules) {
    // early break on no address
    if (!rules.email) {
        return;
    }
    mailer.sendmail(
        rules.email,
        '[FAULTED JOB] ' + event.Job.Release.ProcessKey,
        JSON.stringify(event, undefined, 4),
        function (err) {
            if (err) {
                logger.err(err.message);
            }
        }
    );
}

/**
 * @param {Object} event
 * @param {Object.<string>} rules
 */
function retryJob(event, rules) {
    orchestratorClient.startJob(event.Job, function (err, newJobInfo) {
        if (err) {
            notify(event, rules);
        } else {
            if (!newJobInfo) {
                logger.err('Unable to get the new job info');
            } else {
                jobCache.updateFailure(event.Job.Id, newJobInfo.Id);
            }
        }
    });
}

/** @param {Object} event */
module.exports.handleFaultedJob = function (event) {
    /** @type {string} */
    var processKey = event.Job.Release.ProcessKey;
    /** @type {Object.<string>} */
    var rules = processRules.getRules(processKey);
    /** @type {number} */
    var retryCount;
    /** @type {number} */
    var maxRetry;

    if (!rules) {
        return;
    }
    // early break on no-retry rule
    if (!rules.retry) {
        notify(event, rules);
        return;
    }
    retryCount = jobCache.getFailureCount(event.Job.Id);
    maxRetry = parseInt(rules.retry, 10);
    if (maxRetry === -1 || retryCount < maxRetry) {
        retryJob(event, rules);
    } else {
        notify(event, rules);
    }
};
