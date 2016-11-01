"use strict";
var express = require('express');
var body_parser_1 = require('body-parser');
var compression = require('compression');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
/**
 * Express server instance to run mini-server
 * @author Jānis Radiņš
 */
var ExpressServer = (function () {
    function ExpressServer(port, routes) {
        this.port = port;
        this.routes = routes;
    }
    /**
     * Start the server!
     */
    ExpressServer.prototype.start = function () {
        var _this = this;
        if (this.expressApp) {
            throw new Error("Server is already started!");
        }
        this.expressApp = express();
        this.expressApp.use(body_parser_1.json());
        this.expressApp.use(compression());
        this.expressApp.use(body_parser_1.urlencoded({ extended: true }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(expressSession({
            secret: 'very-secret-key',
            resave: true,
            saveUninitialized: true
        }));
        //Add routes to app configuration
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            this.expressApp.use(route.API_URL, route.router);
        }
        this.expressApp.listen(this.port, function () {
            console.info('ExpressServer started on port:', _this.port);
        });
    };
    /**
     * Some function of unknown added value as used in almost any web page dealing with express server
     * @param port Server port to validate
     * @returns {boolean|number}
     */
    ExpressServer.prototype.normalizePort = function (port) {
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
    };
    return ExpressServer;
}());
exports.ExpressServer = ExpressServer;
