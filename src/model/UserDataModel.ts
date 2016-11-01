import {Document, Model, model, Schema} from "mongoose";
import {Promise} from "es6-promise";

/**
 * User data model representation which abstracts all users data access.
 * @author Jānis Radiņš
 */
export class UserDataModel {

    private static _instance:UserDataModel;
    static get instance():UserDataModel {
        if(!UserDataModel._instance) {
            UserDataModel._instance = new UserDataModel();
        }
        return UserDataModel._instance;
    }

    private readonly model:Model<UserModel> = model<UserModel>(
        "User",
        new Schema({first_name: String, last_name: String, email: String})
    );

    constructor() {
        if(UserDataModel._instance) {
            throw new Error("This is singleton ...");
        }
    }

    /**
     * Add user
     * @param userData
     * @returns {Promise<User>}
     */
    addUser(userData:User):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            new this.model(userData).save((err:any, data:User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Get user by id
     * @param id
     * @returns {Promise<User>}
     */
    getUserById(id:string):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.model.findById(id, (err:any, data:User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Get user by email
     * @param email
     * @returns {Promise<User>}
     */
    getUserByEmail(email:string):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.model.findOne({email:email}, (err:any, data:User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Get all users
     * @returns {Promise<User[]>}
     */
    getAllUsers():Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.model.find((err:any, data:User[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Delete user by id
     * @param id
     * @returns {Promise<User>}
     */
    deleteUserById(id:string):Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.model.findByIdAndRemove(id, (err:any, data:User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    /**
     * Get count of all users
     * @returns {Promise<number>}
     */
    getUsersCount():Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.model.count({}, (err:any, count:number) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
    };
}

/**
 * Single user data interface
 */
export interface User {
    readonly first_name:string;
    readonly last_name:string;
    readonly email:string;
}

/**
 * Internal user data model interface
 */
interface UserModel extends User, Document {

}