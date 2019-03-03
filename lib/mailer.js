'use strict';

// 3rd party
var nodemailer = require("nodemailer");

// local
/** @type {Mailer} */
var transporter;
/** @type {string} */
var from;

/** @param {Object} config */
module.exports.setup = function (config) {
    from = config.from;
    transporter = nodemailer.createTransport(config);
};

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} body
 * @param {function(Error=)} cb
 */
module.exports.sendmail = function (to, subject, body, cb) {
    transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: body
    }, cb);
};
