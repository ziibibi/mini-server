"use strict";
/**
 * List of outgoing application errors
 * @author Jānis Radiņš
 */
var SystemError = (function () {
    function SystemError() {
    }
    SystemError.EXISTING_SESSION_ERROR = {
        errorCode: 1,
        description: "Session is already registered. Please use logout before repeated login."
    };
    SystemError.REQUEST_SESSION_NOT_SET_ERROR = {
        errorCode: 2,
        description: "Session data cannot be found in request."
    };
    SystemError.INVALID_SESSION_ERROR = {
        errorCode: 3,
        description: "Invalid session."
    };
    SystemError.MISSING_EMAIL_ON_LOGIN = {
        errorCode: 4,
        description: "Login must be called with user email set in POST and it's missing"
    };
    SystemError.DB_READ_ERROR = {
        errorCode: 5,
        description: "Database connection error"
    };
    SystemError.UNKNOWN_EMAIL_ERROR = {
        errorCode: 6,
        description: "Unknown email address"
    };
    SystemError.MAX_USER_COUNT_REACHED_ERROR = {
        errorCode: 7,
        description: "Max user count reached error, sadly enough"
    };
    SystemError.NOT_ENOUGHT_DATA_TO_CREATE_USER_ERROR = {
        errorCode: 8,
        description: "Not enought data to create user error"
    };
    return SystemError;
}());
exports.SystemError = SystemError;
