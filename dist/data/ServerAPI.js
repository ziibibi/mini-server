"use strict";
/**
 * Server API current version holder
 */
var ServerAPI = (function () {
    function ServerAPI() {
    }
    /**
     * API address
     * @type {string}
     */
    ServerAPI.VERSION = "/api/v-0.0/";
    return ServerAPI;
}());
exports.ServerAPI = ServerAPI;
