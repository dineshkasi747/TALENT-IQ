import {Inngest} from "inngest";
import { ConnectDB } from "./db.js";
import User from "../models/User.js";


export const inngest = new Inngest({id:"talent-iq"})

const syncUser = inngest.createFunction(
    {id:"talent-iq"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await ConnectDB() 

        const {id,full_name,last_name,email_addresses,image_url} = event.data

        const newUser = {
            clerkId:id,
            name:`${full_name || ""} ${last_name || ""}`,
            email:email_addresses[0]?.email_addresses,
            clerkId:id
        }
        await User.create(newUser)

        // to do 
    }
);

const deleteUser = inngest.createFunction(
    {id:"delete-user"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await ConnectDB()

        const {id} = event.data

        await User.deleteOne({clerkId:id})

        // to do
    }
)

export const functions = [syncUser,deleteUser]