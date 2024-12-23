import mongoose  from "mongoose";

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"add username"]
    },
    email:{
        type:String,
        required:[true,"add email"],
        unique:[true,"unique email plz"]
    },
    password:{
        type:String,
        required:[true,"add password"],
        
    },

},
{
    timestamps:true,
});

export default mongoose.model("User",userSchema);