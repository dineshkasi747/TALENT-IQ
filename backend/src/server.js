import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { ConnectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

console.log(ENV.NODE_ENV)

app.get('/hello',(req,res)=>{
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