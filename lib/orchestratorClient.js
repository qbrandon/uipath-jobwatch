'use strict';

// 3rd party
var Orchestrator = require('uipath-orchestrator');

// local
/** @type {Orchestrator} */
var orchestrator;

module.exports.setup = function (config) {
    orchestrator = new Orchestrator(config);
};

/**
 * @param {{Release: {Key: string}}} jobInfo
 * @param {function(Error, Object=)} cb
 */
module.exports.startJob = function (jobInfo, cb) {
    orchestrator.v2.odata.postStartJobs({
        // TODO better mirror the original job (maybe go back to the source schedule?)
        "startInfo": {
            ReleaseKey: jobInfo.Release.Key, //event.Job.Release.Key,
            Strategy: "JobsCount",
            JobsCount: 1,
            RobotIds: []
        }
    }, function (err, response) {
        /** @type {Object} */
        var jobInfo;

        if (err) {
            cb(err);
            return;
        }
        jobInfo = response && response.value && response.value[0];
        cb(undefined, jobInfo);
    });
};
