"use strict";
var express_1 = require('express');
var ServerAPI_1 = require("../data/ServerAPI");
var SystemError_1 = require("../data/SystemError");
var SessionAuthModel_1 = require("../model/SessionAuthModel");
var UserDataModel_1 = require("../model/UserDataModel");
/**
 * User login requests router
 * @author Jānis Radiņš
 */
var LoginRouter = (function () {
    function LoginRouter() {
        var _this = this;
        this.API_URL = ServerAPI_1.ServerAPI.VERSION;
        this.router = express_1.Router();
        this.sessionAuthModel = SessionAuthModel_1.SessionAuthModel.instance;
        this.usersModel = UserDataModel_1.UserDataModel.instance;
        this.router.post("/login/", function (req, res, next) { return _this.login(req, res, next); });
        this.router.get("/logout/", function (req, res, next) { return _this.logout(req, res, next); });
    }
    /**
     * Handle user POST login request.
     * We expect that any request to this method will come with user email attached as JSON data
     */
    LoginRouter.prototype.login = function (req, res, next) {
        var _this = this;
        /**
         * Check email property is passed - if not be gone, right now
         */
        if (!req.body.hasOwnProperty("email")) {
            res.json(SystemError_1.SystemError.MISSING_EMAIL_ON_LOGIN);
            return;
        }
        /**
         * Validate user email andd if it's there suppose we're fine
         */
        this.usersModel.getUserByEmail(req.body["email"])
            .then(function (user) {
            req.session.authKey = _this.sessionAuthModel.spawnSession().key;
            res.json({
                loggedIn: true,
                authKey: req.session.authKey,
                data: user
            });
        }, function (err) { return res.json(SystemError_1.SystemError.UNKNOWN_EMAIL_ERROR); });
    };
    /**
     * Handle user GET logout request.
     */
    LoginRouter.prototype.logout = function (req, res, next) {
        if (!req.session.authKey) {
            res.json(SystemError_1.SystemError.REQUEST_SESSION_NOT_SET_ERROR);
        }
        else if (!this.sessionAuthModel.removeSessionByKey(req.session.authKey)) {
            res.json(SystemError_1.SystemError.INVALID_SESSION_ERROR);
        }
        else {
            res.json({
                result: "Success"
            });
        }
        delete req.session.authKey;
    };
    return LoginRouter;
}());
exports.LoginRouter = LoginRouter;
