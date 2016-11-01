/**
 * List of outgoing application errors
 * @author Jānis Radiņš
 */
export class SystemError {

    static readonly EXISTING_SESSION_ERROR:ErrorDescription = {
        errorCode:1,
        description:"Session is already registered. Please use logout before repeated login."
    }

    static readonly REQUEST_SESSION_NOT_SET_ERROR:ErrorDescription = {
        errorCode:2,
        description:"Session data cannot be found in request."
    }

    static readonly INVALID_SESSION_ERROR:ErrorDescription = {
        errorCode:3,
        description:"Invalid session."
    }

    static readonly MISSING_EMAIL_ON_LOGIN:ErrorDescription = {
        errorCode: 4,
        description: "Login must be called with user email set in POST and it's missing"
    }

    static readonly DB_READ_ERROR:ErrorDescription = {
        errorCode: 5,
        description: "Database connection error"
    }

    static readonly UNKNOWN_EMAIL_ERROR:ErrorDescription = {
        errorCode: 6,
        description: "Unknown email address"
    }

    static readonly MAX_USER_COUNT_REACHED_ERROR:ErrorDescription = {
        errorCode: 7,
        description: "Max user count reached error, sadly enough"
    }

    static readonly NOT_ENOUGHT_DATA_TO_CREATE_USER_ERROR:ErrorDescription = {
        errorCode: 8,
        description: "Not enought data to create user error"
    }

}

interface ErrorDescription {
    errorCode:number,
    description:string
}