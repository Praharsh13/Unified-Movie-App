//importing packages
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
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//     credentials: true, // Allow cookies and other credentials
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   }));

//   app.options('*',cors());
const allowlist = ( process.env.FRONTEND_URL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// e.g. on Render set:
// CORS_ORIGINS = https://unified-movie-app.vercel.app, http://localhost:5173

const corsOptions = {
  origin(origin, cb) {
    // allow no-origin (Postman, server-to-server)
    if (!origin) return cb(null, true);

    // exact match against allowlist
    if (allowlist.includes(origin)) return cb(null, true);

    // optional: permit Vercel preview deploys
    try {
      const { host } = new URL(origin);
      if (host.endsWith('.vercel.app')) return cb(null, true);
    } catch {}

    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

app.use(cors(corsOptions));
// IMPORTANT: preflights must use the SAME options
app.options('*', cors(corsOptions));

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