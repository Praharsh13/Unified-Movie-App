//Checking if the user is authenticated or not using JWT token

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";


const userAuthentication=asyncHandler(async(req,res,next)=>{
    let token;

    //Read JWT from 'jwt' cookies
    token=req.cookies.jwt
    if(token){
        try{
            const payload=jwt.verify(token,process.env.JWT_KEY);
            //taking everything except password
            req.user=await User.findById(payload.userId).select("-password");
            next();

        }
        catch(error){
            res.status(401)
            throw new Error("User is not Authorized due to failed token")
        }
    }
    else{
        res.status(401)
        throw new Error("Do not have token")
    }
});

//Check if user is admin or not

const ifAdmin=(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).send("not admin")
    }
};

export {userAuthentication,ifAdmin}