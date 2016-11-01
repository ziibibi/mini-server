/**
 * Session authentication model that deals with generating new and updating existing user sessions
 * @author Jānis Radiņš
 */
export class SessionAuthModel {

    private static _instance:SessionAuthModel;
    /**
     * Get singleton instance of model - this is an only way how to get an instance
     * @returns {SessionAuthModel}
     */
    static get instance():SessionAuthModel {
        if (!SessionAuthModel._instance) {
            SessionAuthModel._instance = new SessionAuthModel();
        }
        return SessionAuthModel._instance;
    }

    /**
     * Incative session timeout - 10 minutes in ms
     * @type {number}
     */
    readonly SESSION_TIMEOUT_MS:number = 60*10*1000; //

    private sessionData:SessionData[] = [];

    constructor() {
        if(SessionAuthModel._instance) {
            throw new Error("This is singleton - use SessionAuthModel.instance to get working instance!");
        }
    }

    /**
     * Spawn new session
     * @returns {SessionData}
     */
    spawnSession():SessionData {
        let session:SessionData = {
            key:Math.round(Math.random() * 0xFFFFFFFFFFFFF).toString(16).toUpperCase(),
            created: Date.now(),
            lastActivity: Date.now()
        }
        this.sessionData.push(session);
        return session;
    }

    /**
     * Remove session from active sessions list
     * @param key Session key
     * @returns {boolean} True in case if active session is destroyed for good and false if session with requested
     * session key wasn't found
     */
    removeSessionByKey(key:string):boolean {
        let session:SessionData = this.getSessionByKey(key);
        if (!session) {
            return false;
        }
        this.sessionData.splice(this.sessionData.indexOf(session), 1);
        return true;
    }

    /**
     * Get seesion information by it's key
     * @param key Session key
     * @returns {SessionData}
     */
    getSessionByKey(key:string):SessionData {
        this.closeOutdatedSessions();
        for (let session of this.sessionData) {
            if (session.key === key) {
                return session;
            }
        }
        return null;
    }

    /**
     * Validate session by its key - retrieve session and update its lastActivity if valid session is found
     * @param key Session key
     * @returns {SessionData} If valid session is found or null otherwise
     */
    validateSessionByKey(key:string):SessionData {
        let session:SessionData = this.getSessionByKey(key);
        if (!session) {
            return null;
        }
        session.lastActivity = Date.now();
        return session;
    }

    private closeOutdatedSessions():void {
        for (let session of this.sessionData) {
            if (Date.now() - session.lastActivity >= this.SESSION_TIMEOUT_MS) {
                this.sessionData.splice(this.sessionData.indexOf(session), 1);
            }
        }
    }
}

/**
 * Session data object
 */
export interface SessionData {
    readonly key:string;
    readonly created:number;
    lastActivity:number;
}

