"use strict";
var mongoose_1 = require("mongoose");
var es6_promise_1 = require("es6-promise");
/**
 * User data model representation which abstracts all users data access.
 * @author Jānis Radiņš
 */
var UserDataModel = (function () {
    function UserDataModel() {
        this.model = mongoose_1.model("User", new mongoose_1.Schema({ first_name: String, last_name: String, email: String }));
        if (UserDataModel._instance) {
            throw new Error("This is singleton ...");
        }
    }
    Object.defineProperty(UserDataModel, "instance", {
        get: function () {
            if (!UserDataModel._instance) {
                UserDataModel._instance = new UserDataModel();
            }
            return UserDataModel._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add user
     * @param userData
     * @returns {Promise<User>}
     */
    UserDataModel.prototype.addUser = function (userData) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            new _this.model(userData).save(function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    /**
     * Get user by id
     * @param id
     * @returns {Promise<User>}
     */
    UserDataModel.prototype.getUserById = function (id) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.model.findById(id, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    /**
     * Get user by email
     * @param email
     * @returns {Promise<User>}
     */
    UserDataModel.prototype.getUserByEmail = function (email) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.model.findOne({ email: email }, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    /**
     * Get all users
     * @returns {Promise<User[]>}
     */
    UserDataModel.prototype.getAllUsers = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.model.find(function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    /**
     * Delete user by id
     * @param id
     * @returns {Promise<User>}
     */
    UserDataModel.prototype.deleteUserById = function (id) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.model.findByIdAndRemove(id, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    ;
    /**
     * Get count of all users
     * @returns {Promise<number>}
     */
    UserDataModel.prototype.getUsersCount = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.model.count({}, function (err, count) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(count);
                }
            });
        });
    };
    ;
    return UserDataModel;
}());
exports.UserDataModel = UserDataModel;
