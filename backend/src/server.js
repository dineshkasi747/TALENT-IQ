import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { ConnectDB } from "./lib/db.js";
import cors from "cors";
import {inngest , functions} from "./lib/inngest.js";
import {serve} from "inngest/express";
import { protectRoute } from "./middleware/protectRoute.js";
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js"



const app = express();
const __dirname = path.resolve();

console.log(ENV.NODE_ENV)





app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(clerkMiddleware())

app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chat",chatRoutes)




app.get('/hello',(req,res)=>{
    res.status(200).json({message:"hii there"})
});


app.get('/video-call',protectRoute,(req,res)=>{
    res.status(200).json({message:"hii there"})
});




if(ENV.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get('/{*any}',(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
};

const startServer = async ()=>{
    try {
        await ConnectDB();
        app.listen(ENV.PORT,()=> console.log("port is running in ",ENV.PORT));
    } catch (error) {
        console.error("error starting server",error)
    }
}

startServer()