import { streamClient , clientChat} from "../lib/stream.js"
import Session from "../models/Session.js"

export async function createSession (req,res){
    try {
        const {problem,difficulty} = req.body
        // NOTE: req.user comes from the protectRoute middleware
        const userId = req.user._id 
        const clerkId = req.user.clerkId

        if(!problem || !difficulty){
            return res.status(400).json({message:"problem and difficulty needed"})
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // MongoDB WRITE: This correctly creates and saves the session document.
        const session = await Session.create({problem,difficulty,host:userId,callId})

        // STREAM VIDEO CALL: Initializes the video call object.
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()}
            }
        });

        // STREAM CHAT CHANNEL: Initializes and creates the chat channel.
        const channel = clientChat.channel("messaging",callId,{
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
            
        })

        await channel.create()

        res.status(201).json({session})

    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"internal server error"}) // Fixed typo 'intenal'
    }
};

export async function getActiveSessions (req,res){
    try {
        // FIX: Added await to execute the Mongoose query
        const sessions = await Session.find({status:"active"})
        .populate("host","name profileImage clerkId email")
        .populate("participant","name profileImage clerkId email") // Fixed typo 'paticipant'
        .sort({createdAt:-1})
        .limit(20)

        res.status(200).json({sessions})
    } catch (error) {
        console.error("error retrieving active sessions",error)
        res.status(500).json({message:"internal server error"})
    }
}

export async function getMyRecentSessions (req,res){
    try {
        // NOTE: req.user is correct for getting user ID from protectRoute
        const userId = req.user._id 
        // FIX: Added await to execute the Mongoose query
        const sessions = await Session.find({
            status:"completed",
            $or:[{host:userId} , {participant:userId}]
        })
        .sort({createdAt:-1})
        .limit(20)

        res.status(200).json({sessions})
    } catch (error) {
        console.error("error retrieving recent sessions",error)
        res.status(500).json({message:"internal server error"})
    }
}

export async function getSessionById (req,res){
    try {
        const {id} = req.params

        // FIX: Added await to execute the Mongoose query
        const session = await Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId")

        if (!session) {
             return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json({session})
    } catch (error) {
        console.error("error retrieving session by ID",error)
        res.status(500).json({message:"internal server error"})
    }
}

export async function joinSession (req,res){
    try {
        const {id} = req.params
        // NOTE: req.user is correct, not res.user
        const userId = req.user._id 
        const clerkId = req.user.clerkId

        // FIX: Added await to execute the Mongoose query
        const session = await Session.findById(id)

        if(!session){
            return res.status(404).json({message:"Session not found"}) // Used 404 for clarity
        }
        
        // Check for existing participant using correct spelling
        if(session.participant) return res.status(400).json({message:"Session is full"}) 
        
        session.participant = userId
        await session.save()

        const channel = clientChat.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})
    } catch (error) {
        console.error("error joining session",error)
        res.status(500).json({message:"internal server error"})
    }
}

export async function endSession (req,res){
    try {
        const {id} = req.params
        // NOTE: req.user is correct, not res.user
        const userId = req.user._id

        // FIX: Added await to execute the Mongoose query
        const session = await Session.findById(id)
        if(!session){
            return res.status(404).json({message:"Session not found"})
        }

        if(session.host.toString() !== userId.toString()){
              return res.status(403).json({message:"Only the host can end the session"}) // Used 403 Forbidden
        }

        if(session.status === "completed"){
              return res.status(400).json({message:"Session is already completed"})
        }
        
        session.status = "completed"
        await session.save()

        const call = streamClient.video.call("default",session.callId)
        await call.delete()

        const channel = clientChat.channel("messaging",session.callId)
        await channel.delete()

        res.status(200).json({session})
    } catch (error) {
        console.error("error ending session",error)
        res.status(500).json({message:"internal server error"})
    }
}