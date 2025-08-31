import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import createToken from "../utils/createToken.js";
import { sendRegistrationConfirmationEmail } from "../mail/sendmail.js";

//Registering User

const registerUser= asyncHandler(async(req,res)=>{
    const {username,email,password,ottSubscribed,favoriteGenres }=req.body;
    console.log(username,email,password,ottSubscribed,favoriteGenres)
    // To check if user are filling all feilds
    if(!username || !email || !password || !ottSubscribed || !favoriteGenres){
        throw new Error("Please fill all the required feilds")
    }
    //check if user is already exist
    const userAlreadyExist=await User.findOne({email})
    if(userAlreadyExist){
        res.status(400).send("Email already exist for user")
    }

    //Hashing the user password in database
    const saltRound=12; //salt round use for generating salt
    const salt=await bcrypt.genSalt(saltRound);
    const hashP=await bcrypt.hash(password,salt);
    //Registering user in database
    const newUser=new User({username,email,password:hashP,ottSubscribed,favoriteGenres})
    console.log(newUser);
    sendRegistrationConfirmationEmail(newUser);
    //saving user to database
    try{
        await newUser.save()
        //create token for the user by calling create token function and giving new user id.
        createToken(res,newUser._id);
        res.status(201).json({
            _id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            isAdmin:newUser.isAdmin,
            password:newUser.password,
            ottSubscribed:newUser.ottSubscribed,
            favoriteGenres:newUser.favoriteGenres
        })


    }catch(error){
        res.status(400)
        throw new Error("cannot able to register new user")
    }
     // After successful registration, send confirmation email to the user
     //sendRegistrationConfirmationEmail(newUser.email, newUser.name);
})

//Login user
const signInUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    
    //check from database if user is exist or not
    const userExist = await User.findOne({email});
    //check if existing user have valid password or not
    if(userExist){
        const checkPassword = await bcrypt.compare(password,userExist.password);
        //check password 
        if(checkPassword){
            //create token for authentication
            createToken(res,userExist._id);
            
            res.status(201).json({
                _id:userExist._id,
                username:userExist.username,
                email:userExist.email,
                isAdmin:userExist.isAdmin,
                password:userExist.password,
                ottSubscribed:userExist.ottSubscribed,
                favoriteGenres:userExist.favoriteGenres,
                message:"User Login Successfully"
                
            })
        }else{
            res.status(401).json({message:"Incorrect Password , Please try again"})
        }
    }else{
        res.status(401).json({message:"User email is not in database, please register"})
    }
   
})

//Loging out the user
const signOutUser=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })

    res.status(200).json({message:"User Log out successfully"})
})

//Getting all the Users
const getAllUsers=asyncHandler(async(req,res)=>{
    const allUsers=await User.find({});
    res.json(allUsers)
})

//Getting specific user details
const userDetails=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)
    //User Id will taken from JWT token
    //Check if user is there , provide details
    if(user){
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email,
            isAdmin:user.isAdmin,
            password:user.password,
            ottSubscribed:user.ottSubscribed,
            favoriteGenres:user.favoriteGenres
        })
    }else{
        res.status(404);
        throw new Error("User not found")
    }
})
//Update user profile
const updateUserDetails = asyncHandler(async (req, res) => {
    const updateuser = await User.findById(req.user._id);
    
    // if we find the user
    if (updateuser) {
      updateuser.username = req.body.username || updateuser.username;  // Update username
      updateuser.email = req.body.email || updateuser.email;           // Update email
  
      // If password is provided, hash it
      if (req.body.password) {
        const saltRound = 12; // salt rounds for bcrypt
        const salt = await bcrypt.genSalt(saltRound);
        const hashP = await bcrypt.hash(req.body.password, salt); 
        updateuser.password = hashP;
      }
  
      // Update OTT subscriptions and favorite genres
      updateuser.ottSubscribed = req.body.ottSubscribed || updateuser.ottSubscribed;
      updateuser.favoriteGenres = req.body.favoriteGenres || updateuser.favoriteGenres;
  
      const userUpdated = await updateuser.save();
  
      res.json({
        _id: userUpdated._id,
        username: userUpdated.username,
        email: userUpdated.email,
        isAdmin: userUpdated.isAdmin,
        ottSubscribed: userUpdated.ottSubscribed,
        favoriteGenres: userUpdated.favoriteGenres,
        // message:`${userUpdated.username} updated successfully`
      });
    } else {
      res.status(404);
      throw new Error("User not found, Please check");
    }
  });

  
  

export {registerUser,signInUser,signOutUser,getAllUsers,userDetails,updateUserDetails};