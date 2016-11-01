import * as mongoose from "mongoose";
import {ExpressServer} from "./server/ExpressServer";
import {UsersRouter} from "./controller/UsersRouter";
import {LoginRouter} from "./controller/LoginRouter";

//Connect to db
mongoose.connect("mongodb://localhost/mydb");
//Configure and launch server
let server:ExpressServer = new ExpressServer([
    new LoginRouter(),
    new UsersRouter()
]);
server.start();
