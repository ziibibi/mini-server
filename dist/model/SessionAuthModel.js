"use strict";
/**
 * Session authentication model that deals with generating new and updating existing user sessions
 * @author Jānis Radiņš
 */
var SessionAuthModel = (function () {
    function SessionAuthModel() {
        /**
         * Incative session timeout - 10 minutes in ms
         * @type {number}
         */
        this.SESSION_TIMEOUT_MS = 60 * 10 * 1000; //
        this.sessionData = [];
        if (SessionAuthModel._instance) {
            throw new Error("This is singleton - use SessionAuthModel.instance to get working instance!");
        }
    }
    Object.defineProperty(SessionAuthModel, "instance", {
        /**
         * Get singleton instance of model - this is an only way how to get an instance
         * @returns {SessionAuthModel}
         */
        get: function () {
            if (!SessionAuthModel._instance) {
                SessionAuthModel._instance = new SessionAuthModel();
            }
            return SessionAuthModel._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Spawn new session
     * @returns {SessionData}
     */
    SessionAuthModel.prototype.spawnSession = function () {
        var session = {
            key: Math.round(Math.random() * 0xFFFFFFFFFFFFF).toString(16).toUpperCase(),
            created: Date.now(),
            lastActivity: Date.now()
        };
        this.sessionData.push(session);
        return session;
    };
    /**
     * Remove session from active sessions list
     * @param key Session key
     * @returns {boolean} True in case if active session is destroyed for good and false if session with requested
     * session key wasn't found
     */
    SessionAuthModel.prototype.removeSessionByKey = function (key) {
        var session = this.getSessionByKey(key);
        if (!session) {
            return false;
        }
        this.sessionData.splice(this.sessionData.indexOf(session), 1);
        return true;
    };
    /**
     * Get seesion information by it's key
     * @param key Session key
     * @returns {SessionData}
     */
    SessionAuthModel.prototype.getSessionByKey = function (key) {
        this.closeOutdatedSessions();
        for (var _i = 0, _a = this.sessionData; _i < _a.length; _i++) {
            var session = _a[_i];
            if (session.key === key) {
                return session;
            }
        }
        return null;
    };
    /**
     * Validate session by its key - retrieve session and update its lastActivity if valid session is found
     * @param key Session key
     * @returns {SessionData} If valid session is found or null otherwise
     */
    SessionAuthModel.prototype.validateSessionByKey = function (key) {
        var session = this.getSessionByKey(key);
        if (!session) {
            return null;
        }
        session.lastActivity = Date.now();
        return session;
    };
    SessionAuthModel.prototype.closeOutdatedSessions = function () {
        for (var _i = 0, _a = this.sessionData; _i < _a.length; _i++) {
            var session = _a[_i];
            if (Date.now() - session.lastActivity >= this.SESSION_TIMEOUT_MS) {
                this.sessionData.splice(this.sessionData.indexOf(session), 1);
            }
        }
    };
    return SessionAuthModel;
}());
exports.SessionAuthModel = SessionAuthModel;
