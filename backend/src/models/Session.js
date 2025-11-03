import mongoose  from "mongoose";

const sessionSchenma = new mongoose.Schema({
    problem:{
        type:String,
        required:true,
        unique:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    participant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    session:{
        type:String,
        enum:["active","completed"],
        default:"active"
    },
    callId:{
        type:String,
        default:""
    }
},{timestamps:true})

const Session = mongoose.model("Session",sessionSchenma)

export default Session