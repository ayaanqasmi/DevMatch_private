import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"

const validateTokenHandler=expressAsyncHandler(async (req,res,next)=>{

    let userToken;
    let authHeader=req.headers.authorization;
    
    authHeader=authHeader.split(" ")
    
    if(authHeader && (authHeader[0]=="Bearer")){
        userToken=authHeader[1]
        
        jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                console.log(decoded)
                console.log(err)
                res.status(401)
                throw new Error("unauthorized1")
            }
            console.log(decoded)
            req.user=decoded.user
            next()
        })
        
        if(!userToken){
            res.status(401)
            throw new Error("unauthorized2")
        }
    }
    else{
        res.status(401)
        throw new Error("unauthprized3")
    }


})

export default validateTokenHandler