export async function getStreamToken (req,res) {
    try {
        const token = clientChat.createToken(req.user.clerkId)


        res.status(200).json({ 
            token,
            userName:req.user.name,
            userImage:req.user.ProfileImage, // Assuming you changed this based on prior conversation
            userId:req.user.clerkId
        })
    } catch (error) {
        console.error("error in getStreamToken",error) // Improved error message
        res.status(500).json({message:"internal server error"}) // Fixed response key
    }
}