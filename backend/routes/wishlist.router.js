import express from "express";
const wishlistrouter = express.Router();

import { getWishlist,addToWishlist,removeFromWishlist} from "../controllers/wishlist.controller.js";

import { userAuthentication } from "../middlewares/auth.middleware.js";
//Wishlist router
wishlistrouter.get('/', userAuthentication, getWishlist);         // Get user's wishlist
wishlistrouter.post('/', userAuthentication, addToWishlist);      // Add a movie to the wishlist
wishlistrouter.delete('/:movieId', userAuthentication, removeFromWishlist); 

export default wishlistrouter;