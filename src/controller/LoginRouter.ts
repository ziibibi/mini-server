import {Router, Request, Response, NextFunction} from 'express';
import {CustomRequest} from "../data/CustomRequest";
import {ServerAPI} from "../data/ServerAPI";
import {SystemError} from "../data/SystemError";
import {SessionAuthModel} from "../model/SessionAuthModel";
import {UserDataModel, User} from "../model/UserDataModel";
/**
 * User login requests router
 * @author Jānis Radiņš
 */
export class LoginRouter {

    readonly API_URL:string = ServerAPI.VERSION;
    readonly router:Router = Router();

    private sessionAuthModel:SessionAuthModel = SessionAuthModel.instance;
    private usersModel:UserDataModel = UserDataModel.instance;

    constructor() {

        this.router.post(
            "/login/",
            (req: Request, res: Response, next: NextFunction) => this.login(<CustomRequest> req, res, next)
        );
        this.router.get(
            "/logout/",
            (req: Request, res: Response, next: NextFunction) => this.logout(<CustomRequest> req, res, next)
        );
    }

    /**
     * Handle user POST login request.
     * We expect that any request to this method will come with user email attached as JSON data
     */
    private login(req: CustomRequest, res: Response, next: NextFunction):void {
        /**
         * Check email property is passed - if not be gone, right now
         */
        if (!req.body.hasOwnProperty("email")) {
            res.json(SystemError.MISSING_EMAIL_ON_LOGIN);
            return;
        }

        /**
         * Validate user email andd if it's there suppose we're fine
         */
        this.usersModel.getUserByEmail(req.body["email"])
            .then(
                (user:User) => {
                    req.session.authKey = this.sessionAuthModel.spawnSession().key;
                    res.json({
                        loggedIn: true,
                        authKey: req.session.authKey,
                        data: user
                    });
                },
                (err) => res.json(SystemError.UNKNOWN_EMAIL_ERROR)
            );
    }

    /**
     * Handle user GET logout request.
     */
    private logout(req: CustomRequest, res: Response, next: NextFunction):void {
        if (!req.session.authKey) {
            res.json(SystemError.REQUEST_SESSION_NOT_SET_ERROR);
        } else if(!this.sessionAuthModel.removeSessionByKey(req.session.authKey)) {
            res.json(SystemError.INVALID_SESSION_ERROR);
        } else {
            res.json({
                result: "Success"
            });
        }

        delete req.session.authKey;
    }

}