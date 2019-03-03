module.exports = {
    rules: 'rules.csv',
    // Configuration passed to the Orchestrator client
    // https://github.com/UiPath/orchestrator-nodejs/wiki/Reference#constructor
    orchestrator: {
        tenancyName: 'Default',
        usernameOrEmailAddress: 'admin',
        password: '<password>',
        hostname: 'localhost',
        invalidCertificate: false
    },
    // Configuration of the HTTP listener for webhooks
    webhookServer: {
        addr: '127.0.0.1',  // address passed to the http.Server.listen() method
        port: 3000,         // port passed to the http.Server.listen() method
        secret: 'abcdef'     // secret string (must match the Orchestrator-side Webhook configuration)
    },
    // Configuration passed to Nodemailer
    mailer: {
        from: '"NoReply" <noreply@mydomain.com>',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'username',
            pass: 'password'
        }
    }
};
