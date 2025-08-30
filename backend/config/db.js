//Importing mongoose 
import mongoose from "mongoose";


//Connecting to our database
const connecttoDB= async ()=>{
    try{
        //connecting to db using dotenv
         await mongoose.connect(process.env.DB_URL)
         console.log('Successfully connected to MongoDB')
    }
    catch(error){
        console.log(`Error : ${error.message}`)
        process.exit(1)
    }
}

export default connecttoDB;

