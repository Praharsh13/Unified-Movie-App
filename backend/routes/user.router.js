import express from 'express'


//controllers
import {registerUser,
    signInUser,
    signOutUser,
    getAllUsers,
    userDetails,
    updateUserDetails} 
    from '../controllers/user.controller.js';
    
import { userAuthentication ,ifAdmin} from '../middlewares/auth.middleware.js'

//middlewares

const userRouter=express.Router();
//All user routes
//Route to register user
userRouter.route("/").post(registerUser);
//Route to login user
userRouter.post("/signin",signInUser);
//Router to logout user
userRouter.post("/signout",signOutUser);
//Routes to get all user
userRouter.route("/").get(userAuthentication,ifAdmin,getAllUsers); 
//Routes to get specific user profile
userRouter.route("/userprofile").get(userAuthentication,userDetails);
//Router to update user profile
userRouter.route("/userprofile").post(userAuthentication,updateUserDetails);
export default userRouter;


