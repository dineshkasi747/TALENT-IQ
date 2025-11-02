import { clientChat } from "../lib/stream.js";

export async function getStreamToken (req,res) {
    try {
        const token =  clientChat.createToken(res.user.clerkId)

        req.status(201).json({
            token,
            userName:res.user.name,
            useImage:res.user.image.clerkId,
            userId:res.user.clerkId
        })
    } catch (error) {
        console.error("error occures",error)
        res.status(500).json({mes:"internal server error"})
    }

}