import mongoose from "mongoose"

const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(process.env.CONNECTIONSTRING)
        console.log("connected to database ",connect.connection.host,connect.connection.host)
    }
    catch(err){
        console.log(err);
        process.exit(1)
    }
};

export default connectDb