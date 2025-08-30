import User from "./user.model.js";
import Movie from "./movie.model.js";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Wishlist Schema
const wishlistSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Link to the User model
    required: true,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',  // Link to the Movie model
      required: true,
    },
  ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
