'use strict';

// 3rd party
var WebhookServer = require('uipath-webhooks').WebhookServer;

// local
var logger = require('./simpleLogger');
var eventHandler = require('./eventHandler');

/**
 * @param {{secret: string, addr: string, port: number}} config
 * @param cb
 */
module.exports.setup = function (config, cb) {
    var server = new WebhookServer(config.secret);
    server.on('job.faulted', eventHandler.handleFaultedJob);
    server.listen(config.port, config.addr, function (err) {
        if (err) {
            cb(err);
            return;
        }
        logger.info('Listening on ' + config.addr + ":" + config.port);
        cb();
    });
};
