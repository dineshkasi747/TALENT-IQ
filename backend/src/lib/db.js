import mongoose from "mongoose";
import {ENV} from "./env.js";

export const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("connected to db",conn.connection.host)
    } catch (error) {
        console.error("error connecting db",error);
        process.exit(1)
    }
}