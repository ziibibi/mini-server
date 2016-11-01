import {Request} from 'express';
/**
 * Custom request object that includes body and session objects unlike native express Request
 * @author Jānis Radiņš
 */
export interface CustomRequest extends Request {
    /**
     * Once body-parser is added there's body property in request but no signature of it in incoming Request
     */
    body?: {[name:string]:any},
    /**
     * expressSession session data object with some custom glue for particular use case
     */
    session?: {
        authKey?:string,
        [name:string]:any
    }
}