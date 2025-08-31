//importing packages
import helmet from 'helmet';
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';


//importing files
import connecttoDB from "./config/db.js";
import userRouter from "./routes/user.router.js";
import genrerouter from "./routes/genre.router.js";
import router from "./routes/movie.router.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import wishlistrouter from "./routes/wishlist.router.js";

//configuration
dotenv.config()
connecttoDB()


const app=express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and other credentials
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));

  app.options('*',cors());



// --- Security headers ---



// Security headers (turn CSP off for now to avoid 'default-src none')
// app.set('trust proxy', 1);
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false,
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
// }));

// TEMP: permissive CORS to unblock


const PORT = process.env.PORT || 3002

//Routes

//1.User Routes(SingIn and SignUp)
app.use("/movieapp/users",userRouter);
//1.Genre creation
app.use("/movieapp/genre",genrerouter);
//Movie Routes
app.use("/movieapp/movies",router);
app.use("/movieapp/wishlist",wishlistrouter)
//Upload the image 
app.use("/movieapp/upload", uploadRoutes);


//to upload image path
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

//Server
app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))