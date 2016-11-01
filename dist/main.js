"use strict";
var mongoose = require("mongoose");
var ExpressServer_1 = require("./server/ExpressServer");
var UsersRouter_1 = require("./controller/UsersRouter");
var LoginRouter_1 = require("./controller/LoginRouter");
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel;
if (!mongoURL && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(), mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'], mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'], mongoDatabase = process.env[mongoServiceName + '_DATABASE'], mongoPassword = process.env[mongoServiceName + '_PASSWORD'], mongoUser = process.env[mongoServiceName + '_USER'];
    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
}
//Connect to db
mongoose.connect(mongoURL, function (err, conn) {
    if (err) {
        console.error('Error while connecting to MongoDB e: %s', err);
    }
    else {
        console.log('Connected to MongoDB at: %s', mongoURL);
    }
});
/**
 * Some function of unknown added value as used in almost any web page dealing with express server
 * @param port Server port to validate
 * @returns {boolean|number}
 */
function normalizePort(port) {
    var normalizedPort = parseInt(port, 10);
    if (isNaN(normalizedPort)) {
        // named pipe
        return port;
    }
    if (normalizedPort >= 0) {
        // port number
        return normalizedPort;
    }
    return false;
}
//Configure and launch server
var server = new ExpressServer_1.ExpressServer(normalizePort(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080), [new LoginRouter_1.LoginRouter(), new UsersRouter_1.UsersRouter()]);
server.start();
