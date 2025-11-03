import { streamClient , clientChat} from "../lib/stream.js"
import Session from "../models/Session.js"

export async function createSession (req,res){
    try {
        const {problem,difficulty} = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if(!problem || !difficulty){
            return res.status(400).json({message:"problem and difficulty needed"})
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const session = await Session.create({problem,difficulty,host:userId,callId})

        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()}
            }
        });

        const channel = clientChat.channel("messaging",callId,{
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
            
        })

        await channel.create()

        res.status(201).json({session})

    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
};

export async function getActiveSessions (req,res){
    try {
        const sessions = (await Session.find({status:"active"})
        .populate("host","name profileImage clerkId email"))
        .sort({createdAt:-1})
        .limit(20)

        res.status(200).json({sessions})
    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
}

export async function getMyRecentSessions (req,res){
    try {
        const userId = res.user._id
        const sessions = Session.find({
            status:"completed",
            $or:[{host:userId} , {participant:userId}]
        })
        .sort({createdAt:-1})
        .limit(20)

        res.status(200).json({sessions})
    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
}

export async function getSessionById (req,res){
    try {
        const {id} = req.params

        const session = Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId")

        res.status(200).json({session})
    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
}

export async function joinSession (req,res){
    try {
        const {id} = req.params
        const userId = res.user._id
        const clerkId = res.user.clerkId

        const session = Session.findById(id)

        if(!session){
            return res.status(400).json({message:"session not found"})
        }
        if(session.paricipant) res.status(400).json({message:"session is full"})
        session.participant = userId
        await session.save()

        const channel = clientChat.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})
    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
}

export async function endSession (req,res){
    try {
        const {id} = req.params
        const userId = res.user._id

        const session = Session.findById(id)
        if(!session){
            return res.status(400).json({message:"session not found"})
        }

        if(session.host.toString()!==userId.toString()){
             return res.status(400).json({message:"only user can end sesson"})
        }

        if(session.status == "completed"){
             return res.status(400).json({message:"session is already completed"})
        }
        session.status = "completed"
        await session.save()

        const call = streamClient.video.call("default",session.callId)
        await call.delete()

        const channel = clientChat.channel("messaging",session.callId)
        await channel.delete()

        res.status(200).json({session})
    } catch (error) {
        console.error("error creating session",error)
        res.status(500).json({message:"intenal server error"})
    }
}