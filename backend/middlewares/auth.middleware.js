//Checking if the user is authenticated or not using JWT token

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";


// const userAuthentication=asyncHandler(async(req,res,next)=>{
//     let token;

//     //Read JWT from 'jwt' cookies
//     token=req.cookies.jwt
//     if(token){
//         try{
//             const payload=jwt.verify(token,process.env.JWT_KEY);
//             //taking everything except password
//             req.user=await User.findById(payload.userId).select("-password");
//             next();

//         }
//         catch(error){
//             res.status(401)
//             throw new Error("User is not Authorized due to failed token")
//         }
//     }
//     else{
//         res.status(401)
//         throw new Error("Do not have token")
//     }
// });

// //Check if user is admin or not

// const ifAdmin=(req,res,next)=>{
//     if(req.user && req.user.isAdmin){
//         next()
//     }else{
//         res.status(401).send("not admin")
//     }
// };

// export {userAuthentication,ifAdmin}

const getToken = req => {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) return auth.slice(7)
    return req.cookies?.jwt || null
  }
  
  // Strict auth: blocks if missing/invalid
  export const userAuthentication = async (req, res, next) => {
    try {
      const token = getToken(req)
      if (!token) return res.status(401).json({ message: 'Unauthorised' })
  
      const secret = process.env.JWT_SECRET || process.env.JWT_KEY
      if (!secret) return res.status(500).json({ message: 'Server misconfigured: missing JWT secret' })
  
      const payload = jwt.verify(token, secret)
      const user = await User.findById(payload.userId).select('-password')
      if (!user) return res.status(401).json({ message: 'Unauthorised' })
  
      req.user = user
      return next()
    } catch {
      return res.status(401).json({ message: 'Unauthorised' })
    }
  }
  
  // Optional auth: attaches user if present, otherwise continues as public
  export const attachUserIfPresent = async (req, _res, next) => {
    try {
      const token = getToken(req)
      if (!token) return next()
  
      const secret = process.env.JWT_SECRET || process.env.JWT_KEY
      const payload = jwt.verify(token, secret)
      req.user = await User.findById(payload.userId).select('-password')
    } catch {
      // ignore and continue as anonymous
    }
    return next()
  }
  
  // Admin gate
  export const ifAdmin = (req, res, next) => {
    if (req.user?.isAdmin) return next()
    return res.status(403).json({ message: 'Admin only' })
  }