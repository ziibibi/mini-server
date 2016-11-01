"use strict";
var express_1 = require('express');
var ServerAPI_1 = require("../data/ServerAPI");
var UserDataModel_1 = require("../model/UserDataModel");
var SystemError_1 = require("../data/SystemError");
var SessionAuthModel_1 = require("../model/SessionAuthModel");
/**
 * User data router
 * @author Jānis Radiņš
 */
var UsersRouter = (function () {
    function UsersRouter() {
        var _this = this;
        this.API_URL = ServerAPI_1.ServerAPI.VERSION;
        this.MAX_USER_COUNT = 20;
        this.PROD_MODE = false;
        this.router = express_1.Router();
        this.sessionModel = SessionAuthModel_1.SessionAuthModel.instance;
        this.usersModel = UserDataModel_1.UserDataModel.instance;
        /**
         * Validate user session before any of get|post|delete requests
         */
        this.router.get("/*", function (req, res, next) { return _this.validateSession(req, res, next); });
        this.router.post("/*", function (req, res, next) { return _this.validateSession(req, res, next); });
        this.router.delete("/*", function (req, res, next) { return _this.validateSession(req, res, next); });
        this.router.get("/users/", function (req, res, next) { return _this.getAllUsers(req, res, next); });
        this.router.get("/users/:id", function (req, res, next) { return _this.getUserById(req, res, next); });
        this.router.post("/users/", function (req, res, next) { return _this.addUser(req, res, next); });
        this.router.delete("/users/:id", function (req, res, next) { return _this.deleteUserById(req, res, next); });
    }
    UsersRouter.prototype.validateSession = function (req, res, next) {
        /**
         * Validate user session before any of requests if we're in prod mode
         * (session cookies doesn't work that well when executing node test/*.js)
         */
        if (this.PROD_MODE && !this.sessionModel.validateSessionByKey(req.session.authKey)) {
            res.json(SystemError_1.SystemError.INVALID_SESSION_ERROR);
            return;
        }
        next();
    };
    UsersRouter.prototype.getAllUsers = function (req, res, next) {
        this.usersModel.getAllUsers()
            .then(function (data) { return res.json(data); }, function (error) { return res.json({ errorCode: SystemError_1.SystemError.DB_READ_ERROR, error: error }); });
    };
    UsersRouter.prototype.getUserById = function (req, res, next) {
        var userId = req.params['id'];
        this.usersModel.getUserById(userId)
            .then(function (data) { return res.json(data); }, function (error) { return res.json({ errorCode: SystemError_1.SystemError.DB_READ_ERROR, error: error }); });
    };
    UsersRouter.prototype.addUser = function (req, res, next) {
        var _this = this;
        if (!req.body.hasOwnProperty('first_name') || !req.body.hasOwnProperty('last_name') || !req.body.hasOwnProperty('email')) {
            res.json(SystemError_1.SystemError.NOT_ENOUGHT_DATA_TO_CREATE_USER_ERROR);
            return;
        }
        this.usersModel.getUsersCount().then(function (count) {
            if (count === _this.MAX_USER_COUNT) {
                res.json(SystemError_1.SystemError.MAX_USER_COUNT_REACHED_ERROR);
                return;
            }
            var userData = {
                first_name: req.body['first_name'],
                last_name: req.body['last_name'],
                email: req.body['email']
            };
            _this.usersModel.addUser(userData)
                .then(function (data) { return res.json(data); }, function (error) { return res.json({ errorCode: SystemError_1.SystemError.DB_READ_ERROR, error: error }); });
        });
    };
    UsersRouter.prototype.deleteUserById = function (req, res, next) {
        var userId = req.params['id'];
        this.usersModel.deleteUserById(userId)
            .then(function (data) { return res.json(data); }, function (error) { return res.json({ errorCode: SystemError_1.SystemError.DB_READ_ERROR, error: error }); });
    };
    return UsersRouter;
}());
exports.UsersRouter = UsersRouter;
