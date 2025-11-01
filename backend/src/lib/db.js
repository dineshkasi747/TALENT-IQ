import mongoose from "mongoose";
import {ENV} from "./env.js";

export const ConnectDB = async () => {
    try {
        if(!ENV.DB_URL){
            throw new error("no db is found to connect")
        }
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("connected to db",conn.connection.host)
    } catch (error) {
        console.error("error connecting db",error);
        process.exit(1)
    }
}