import * as mongoose from "mongoose";
import {ExpressServer} from "./server/ExpressServer";
import {UsersRouter} from "./controller/UsersRouter";
import {LoginRouter} from "./controller/LoginRouter";


var mongoURL:string = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel:string;

if (!mongoURL && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

    }
}
//Connect to db
mongoose.connect(mongoURL, (err, conn) => {
    if (err) {
        console.error('Error while connecting to MongoDB e: %s', err);
    } else {
        console.log('Connected to MongoDB at: %s', mongoURL);
    }
});

//Configure and launch server
let server:ExpressServer = new ExpressServer([
    new LoginRouter(),
    new UsersRouter()
]);
server.start();
