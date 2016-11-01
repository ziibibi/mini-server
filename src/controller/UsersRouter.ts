import { Router, Request, Response, NextFunction } from 'express';
import {ServerAPI} from "../data/ServerAPI";
import {UserDataModel, User} from "../model/UserDataModel";
import {SystemError} from "../data/SystemError";
import {CustomRequest} from "../data/CustomRequest";
import {SessionAuthModel} from "../model/SessionAuthModel";

/**
 * User data router
 * @author Jānis Radiņš
 */
export class UsersRouter {

    readonly API_URL:string = ServerAPI.VERSION;
    readonly MAX_USER_COUNT:number = 20;
    readonly PROD_MODE:boolean = false;

    readonly router:Router = Router();

    private sessionModel:SessionAuthModel = SessionAuthModel.instance;
    private usersModel:UserDataModel = UserDataModel.instance;

    constructor() {
        /**
         * Validate user session before any of get|post|delete requests
         */
        this.router.get("/*", (req: Request, res: Response, next: NextFunction) => this.validateSession(<CustomRequest>req, res, next));
        this.router.post("/*", (req: Request, res: Response, next: NextFunction) => this.validateSession(<CustomRequest>req, res, next));
        this.router.delete("/*", (req: Request, res: Response, next: NextFunction) => this.validateSession(<CustomRequest>req, res, next));

        this.router.get("/users/",
            (req: Request, res: Response, next: NextFunction) => this.getAllUsers(<CustomRequest> req, res, next)
        );
        this.router.get("/users/:id",
            (req: Request, res: Response, next: NextFunction) => this.getUserById(<CustomRequest> req, res, next)
        );
        this.router.post("/users/",
            (req: Request, res: Response, next: NextFunction) => this.addUser(<CustomRequest> req, res, next)
        );
        this.router.delete("/users/:id",
            (req: Request, res: Response, next: NextFunction) => this.deleteUserById(<CustomRequest> req, res, next)
        );
    }

    private validateSession(req: CustomRequest, res: Response, next: NextFunction):void {
        /**
         * Validate user session before any of requests if we're in prod mode
         * (session cookies doesn't work that well when executing node test/*.js)
         */
        if (this.PROD_MODE && !this.sessionModel.validateSessionByKey(req.session.authKey)) {
            res.json(SystemError.INVALID_SESSION_ERROR);
            return;
        }

        next();
    }

    private getAllUsers(req: CustomRequest, res: Response, next: NextFunction):void {
        this.usersModel.getAllUsers()
            .then(
                (data:User[]) => res.json(data),
                (error) => res.json({errorCode: SystemError.DB_READ_ERROR, error: error})
            );
    }

    private getUserById(req: CustomRequest, res: Response, next: NextFunction):void {
        const userId:string = req.params['id'];
        this.usersModel.getUserById(userId)
            .then(
                (data:User) => res.json(data),
                (error) => res.json({errorCode: SystemError.DB_READ_ERROR, error: error})
            );
    }

    private addUser(req: CustomRequest, res: Response, next: NextFunction):void {
        if (!req.body.hasOwnProperty('first_name') || !req.body.hasOwnProperty('last_name') || !req.body.hasOwnProperty('email')) {
            res.json(SystemError.NOT_ENOUGHT_DATA_TO_CREATE_USER_ERROR);
            return;
        }

        this.usersModel.getUsersCount().then((count:number) => {
            if (count === this.MAX_USER_COUNT) {
                res.json(SystemError.MAX_USER_COUNT_REACHED_ERROR);
                return;
            }

            let userData:User = {
                first_name: req.body['first_name'],
                last_name: req.body['last_name'],
                email: req.body['email']
            };

            this.usersModel.addUser(userData)
                .then(
                    (data:User) => res.json(data),
                    (error) => res.json({errorCode: SystemError.DB_READ_ERROR, error: error})
                );
        });
    }

    private deleteUserById(req: CustomRequest, res: Response, next: NextFunction):void {
        const userId:string = req.params['id'];
        this.usersModel.deleteUserById(userId)
            .then(
                (data:User) => res.json(data),
                (error) => res.json({errorCode: SystemError.DB_READ_ERROR, error: error})
            );
    }

}