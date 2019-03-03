'use strict';

// native
var path = require('path');

// local
var logger = require('./simpleLogger');
var config = require('./config').getConfig();
var orchestratorClient = require('./orchestratorClient');
var hookListener = require('./hookListener');
var mailer = require('./mailer');
var processRules = require('./processRules');

/** @type {string} */
var rulesPath;

/** @param {Error} err */
function handleError(err) {
    if (err) {
        logger.err(err.message);
        process.exit(1);
    }
}

if (config === undefined) {
    handleError(new Error('Failed reading configuration'));
}

rulesPath = path.join(__dirname, '..', 'config', config.rules);

orchestratorClient.setup(config.orchestrator);
mailer.setup(config.mailer);
processRules.setup(rulesPath, function (err) {
    handleError(err);
    hookListener.setup(config.webhookServer, function (err) {
        handleError(err);
    });
});
