import mongoose from "mongoose";

//Create User schema for registration
const userSchema= mongoose.Schema({
    //Username of user
    username:{
        type: String,
        required:true,
    },
    //Email of user
    email:{
        type:String,
        required:true,
        unique:true,
    },
    //Password 
    password:{
        type:String,
        required:true,
    },
    wishlist: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Movie',  // Linking to Movie Model
        },
    ],
    // User is admin or not
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
     // Array of OTT platforms the user is subscribed to (e.g., Netflix, Amazon, Hulu)
     ottSubscribed: {
        type: [String],
        enum: ['Netflix', 'Amazon Prime', 'Hulu', 'Disney+', 'HBO Max', 'Apple TV+'], // predefined platforms
        required: true,
    },
    // Array of genres the user is interested in (e.g., Action, Comedy, Drama)
    favoriteGenres: {
        type: [String],
        enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary','Kids'], // predefined genres
        required: true,
    }
    },    
    {
    timestamps:true

});

const User=mongoose.model("User",userSchema);
export default User;