import * as express from 'express';
import { Router } from 'express';
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';

/**
 * Express server instance to run mini-server
 * @author Jānis Radiņš
 */
export class ExpressServer {

    readonly PORT:boolean|number = this.normalizePort(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);

    private expressApp:express.Application;

    constructor(private routes:{readonly API_URL:string, readonly router:Router}[]) {

    }

    /**
     * Start the server!
     */
    start():void {
        if (this.expressApp) {
            throw new Error("Server is already started!");
        }

        this.expressApp = express();
        this.expressApp.use(json());
        this.expressApp.use(compression());
        this.expressApp.use(urlencoded({extended:true}));
        this.expressApp.use(cookieParser());
        this.expressApp.use(expressSession({
            secret:'very-secret-key',
            resave: true,
            saveUninitialized : true
        }));
        //Add routes to app configuration
        for (let route of this.routes) {
            this.expressApp.use(route.API_URL, route.router);
        }
        this.expressApp.listen(this.PORT, () => {
            console.info('ExpressServer started on port:', this.PORT)
        });
    }

    /**
     * Some function of unknown added value as used in almost any web page dealing with express server
     * @param port Server port to validate
     * @returns {boolean|number}
     */
    private normalizePort(port:any):boolean|number {
        const normalizedPort:number = parseInt(port, 10);
        if (isNaN(normalizedPort)) {
            // named pipe
            return port;
        }
        if (normalizedPort >= 0) {
            // port number
            return normalizedPort;
        }
        return false;
    }

 }
