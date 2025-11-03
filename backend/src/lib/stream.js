import {StreamChat} from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk"

import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("no streamapi key or stream secret is found",error)
}

export const clientChat = StreamChat.getInstance(apiKey,apiSecret)
export const streamClient = new StreamClient(apiKey,apiSecret)

export const upsertStreamUser = async (userdata) => {
    try {
        await clientChat.upsertUser(userdata)
        console.log("client upserted succesfully")
    } catch (error) {
        console.error("error upserting user",error)
    }
};

export const deleteStreamUser = async (userId) => {
    try {
        await clientChat.deleteUser(userId)
        console.log("user deleted from stream")
    } catch (error) {
        console.error("error deleting ",error)
    }
}