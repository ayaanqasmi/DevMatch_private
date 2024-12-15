import express from "express"
import { configDotenv } from "dotenv"
import connectDb from "./config/connectDb.js"

const dotenv=configDotenv()

connectDb();

const port=process.env.PORT||3000
const app=express()




app.use(express.json())

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})