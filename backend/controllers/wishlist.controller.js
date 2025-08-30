import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";
import Wishlist from "../models/wishlist.model.js";

//Get movie list of user from wishlist
const getWishlist = async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('movies');
      
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Add a movie to the user's wishlist
  
  const addToWishlist = async (req, res) => {
    const { movieId } = req.body;
  
    try {
      // Find or create the user's wishlist
      let wishlist = await Wishlist.findOne({ user: req.user._id });
  
      if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, movies: [] });
      }
  
      // Check if movie is already in wishlist
      if (!wishlist.movies.includes(movieId)) {
        wishlist.movies.push(movieId);
        await wishlist.save();
      }
  
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  //     Remove a movie from the user's wishlist
  
  const removeFromWishlist = async (req, res) => {
    const { movieId } = req.params;
  
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      // Remove the movie from wishlist
      wishlist.movies = wishlist.movies.filter((id) => id.toString() !== movieId);
      await wishlist.save();
  
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  export {removeFromWishlist,addToWishlist,getWishlist}