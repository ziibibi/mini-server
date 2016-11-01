"use strict";
var mongoose = require("mongoose");
var ExpressServer_1 = require("./server/ExpressServer");
var UsersRouter_1 = require("./controller/UsersRouter");
var LoginRouter_1 = require("./controller/LoginRouter");
//Connect to db
mongoose.connect("mongodb://localhost/mydb");
//Configure and launch server
var server = new ExpressServer_1.ExpressServer([
    new LoginRouter_1.LoginRouter(),
    new UsersRouter_1.UsersRouter()
]);
server.start();
