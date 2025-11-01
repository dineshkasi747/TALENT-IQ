import express from "express";
import { ENV } from "./lib/env.js";

const app = express();

app.get('/',(req,res)=>{
    res.status(200).json({message:"hii there"})
});


app.listen(ENV.PORT,()=>{
    console.log("port is running in ",ENV.PORT)
})