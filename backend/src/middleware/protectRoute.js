import {requireAuth} from "@clerk/express"
import User from "../models/User.js"


export const protectRoute = [
    requireAuth(),
    async (req,res,next) => {
        try {
            const clerkId = req.auth.userId

            if(!clerkId) res.status(401).json({message:" invalid authentication"})

                const user = await User.findOne({clerkId})

                if(!user) res.status(404).json({message:"id is not found invalid authentication"})

                req.user = user

                next()

        } catch (error) {
            console.error("error in protected middleware",error)
            res.status(500).json("internal server error")
        }
    }
]