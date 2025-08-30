import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";
import Genre from '../models/genre.model.js';
import mongoose from "mongoose";
import axios from "axios";
//import fetchMoviesFromJustWatch from "../config/justapi.js";
import fetch from 'node-fetch'; // Import fetch
const TMDB_API_KEY ="e98bd45cd5f4806586201aacf183bdde"
//Function to create movie
const createMovie = async (req, res) => {
    try {
      const newMovie = new Movie(req.body);
      const savedMovie = await newMovie.save();
      res.json(savedMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const getAllMovies = async (req, res) => {
    try {
      const movies = await Movie.find();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  




// Controller function to get movies for a user based on their subscribed OTT platforms
const getMoviesForUser = async (req, res) => {
    try {
      // Get the user's ID from the request (assuming user is authenticated and req.user is set)
      const userId = req.user._id;
  
      // Fetch user details to get the ottSubscribed array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed } = user;
  
      // Ensure the user has at least one OTT subscription
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Fetch movies where the movie's ott array contains at least one of the user's subscribed OTT platforms
      const movies = await Movie.find({
        ottPresent: { $in: ottSubscribed }, // Filter movies where at least one of the OTT platforms is in the user's subscription list
      });
  
      // If no movies are found
      if (movies.length === 0) {
        return res.status(404).json({ message: "No movies found for the subscribed OTT platforms" });
      }
  
      // Return the filtered list of movies
      return res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error, please try again later." });
    }
  };




  //Find specific list for user of movie 
  const getSpecificUserMovie = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate that the movie ID is a valid ObjectId
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
  
      // Get the user's ID from the request (assuming user is authenticated)
      const userId = req.user?._id;  // Ensure req.user exists
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      // Fetch user details to get the ottSubscribed array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed } = user;
  
      // Ensure the user has at least one OTT subscription
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Fetch the specific movie by ID
      const specificMovie = await Movie.findById(id);
      if (!specificMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      // Check if the movie's OTT platform matches any of the user's subscribed platforms
      const movieOttPlatforms = specificMovie.ottPresent; // Assuming it's an array of OTT platforms
      const isSubscribed = movieOttPlatforms.some((platform) =>
        ottSubscribed.includes(platform)
      );
  
      // If the user is not subscribed to any of the OTT platforms where the movie is available
      if (!isSubscribed) {
        return res
          .status(403)
          .json({ message: "No movie found for your subscribed OTT platforms" });
      }
  
      // If the user is subscribed to at least one platform, return the movie details
      res.json(specificMovie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //Testing to get specific movie details
  const getSpecificMovie = async (req, res) => {
    try {
      const { id } = req.params;
      const specificMovie = await Movie.findById(id);
      if (!specificMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.json(specificMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Serach movie through API
  const searchMovieInDatabaseAndApi = async (req, res) => {
    try {
      const { title } = req.params;
      const userId = req.user?._id;
      console.log("Received search request for title:", req.params.title);
      // Verify user authentication
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      // Get user and their subscribed OTT platforms
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { ottSubscribed } = user;
  
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Step 1: Search in the database
      let specificMovie = await Movie.findOne({ name: title });
  
      if (specificMovie) {
        // Check if movie is available on any of the user's OTT subscriptions
        const isSubscribed = specificMovie.ottPresent.some(platform =>
          ottSubscribed.includes(platform)
        );
  
        if (!isSubscribed) {
          return res.status(403).json({ message: "No movie found for your subscribed OTT platforms" });
        }
  
        return res.json(specificMovie);
      }
  
      // Step 2: Search in TMDB API if movie is not in the database
      const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          language: 'en-US',
        },timeout:5000
      });
  
      const movies = tmdbResponse.data.results;
  
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "Movie not found on TMDB" });
      }
  
      const movie = movies[0];
  
      // Step 3: Check OTT platform availability for the movie
      const providersResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`,
        { params: { api_key:TMDB_API_KEY },timeout:5000 }
      );
  
      const availablePlatforms = providersResponse.data.results?.US?.flatrate || [];
      const availablePlatformNames = availablePlatforms.map(provider => provider.provider_name);
  
      // Check if any of the user's OTT subscriptions match available platforms
      const hasValidSubscription = availablePlatformNames.some(platform =>
        ottSubscribed.includes(platform)
      );
  
      if (!hasValidSubscription) {
        return res.status(403).json({ message: "No movie found for your subscribed OTT platforms" });
      }
  
      // Step 4: Ensure the genre exists in the database
      const firstGenreId = movie.genre_ids[0];
      const genreName = await getGenreNameById(firstGenreId);
  
      let genre = await Genre.findOne({ name: genreName });
      if (!genre) {
        genre = new Genre({ name: genreName });
        await genre.save();
      }
  
      // Step 5: Save the movie in the database
      specificMovie = new Movie({
        name: movie.title,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        year: new Date(movie.release_date).getFullYear(),
        genre: genre._id,
        detail: movie.overview,
        reviews: [],
        numReviews: 0,
        movieLink: movie.homepage || '',
        adultRating: movie.adult ? 'R' : 'PG-13',
        ottPresent: availablePlatformNames
      });
  
      await specificMovie.save();
  
      return res.json(specificMovie);
  
    } catch (error) {
      console.error(error);
      console.error("Error in searchMovieInDatabaseAndApi:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Helper function to map TMDB genre IDs to names
  const getGenreNameById = async (genreId) => {
    const genreMap = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    return genreMap[genreId] || 'Unknown';
  };





  // Update movie with movie id

  const updateMovie = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Movie reviewing
  const movieReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const movie = await Movie.findById(req.params.id);
  
      if (movie) {
        const alreadyReviewed = movie.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
  
        if (alreadyReviewed) {
          res.status(400);
          throw new Error("Movie already reviewed");
        }
  
        const review = {
          name: req.user.username,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
  
        movie.reviews.push(review);
        movie.numReviews = movie.reviews.length;
        movie.rating =
          movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length;
  
        await movie.save();
        res.status(201).json({ message: "Review Added" });
      } else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      console.error(error);
      res.status(400).json(error.message);
    }
  };
  //Delete movie
  const deleteMovie = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteMovie = await Movie.findByIdAndDelete(id);
  
      if (!deleteMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.json({ message: "Movie Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  //Delete comment
  const deleteComment = async (req, res) => {
    try {
      const { movieId, reviewId } = req.body;
      const movie = await Movie.findById(movieId);
  
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      const reviewIndex = movie.reviews.findIndex(
        (r) => r._id.toString() === reviewId
      );
  
      if (reviewIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      movie.reviews.splice(reviewIndex, 1);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.length > 0
          ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
            movie.reviews.length
          : 0;
  
      await movie.save();
      res.json({ message: "Comment Deleted Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //New movie API
  const getNewMovies = async (req, res) => {
    try {
      // Get the user's ID from the request (assuming the user is authenticated and req.user is set)
      const userId = req.user._id;
  
      // Fetch the user's details to get the ottSubscribed array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed } = user;
  
      // Ensure the user has at least one OTT subscription
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Fetch the latest movies, limit to 10, and filter by the user's OTT subscriptions
      const newMovies = await Movie.find({
        ottPresent: { $in: ottSubscribed }, // Filter movies where ott array matches user's subscribed platforms
      })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(10);
  
      // Return the filtered list of movies
      res.json(newMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //TOP MOVIE API
  const getTopMovies = async (req, res) => {
    try {
      // Get the user's ID from the request (assuming the user is authenticated)
      const userId = req.user._id;
  
      // Fetch the user's details to get the ottSubscribed array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed } = user;
  
      // Ensure the user has at least one OTT subscription
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Fetch top-rated movies filtered by user's OTT subscriptions, sort by number of reviews
      const topRatedMovies = await Movie.find({
        ottPresent: { $in: ottSubscribed }, // Filter movies by user's subscribed platforms
      })
        .sort({ numReviews: -1 }) // Sort by highest number of reviews
        .limit(10); // Limit to 10 movies
  
      // Return the filtered list of top-rated movies
      res.json(topRatedMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //RANDOM MOVIE API
  const getRandomMovies = async (req, res) => {
    try {
      // Get the user's ID from the request (assuming the user is authenticated)
      const userId = req.user._id;
  
      // Fetch the user's details to get the ottSubscribed array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed } = user;
  
      // Ensure the user has at least one OTT subscription
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
  
      // Fetch random movies filtered by user's OTT subscriptions
      const randomMovies = await Movie.aggregate([
        { $match: { ottPresent: { $in: ottSubscribed } } }, // Filter by user's subscribed OTT platforms
        { $sample: { size: 10 } } // Randomly select 10 movies
      ]);
  
      // Return the filtered random movies
      res.json(randomMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //Recomendation System
  const getRecommendedMovies = async (req, res) => {
    try {
      // Get the user's ID from the request (assuming the user is authenticated)
      const userId = req.user._id;
  
      // Fetch the user's details to get the ottSubscribed and favoriteGenres arrays
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { ottSubscribed, favoriteGenres } = user;
  
      // Ensure the user has at least one OTT subscription and favorite genre
      if (!ottSubscribed || ottSubscribed.length === 0) {
        return res.status(400).json({ message: "No OTT subscriptions found for user" });
      }
      
      if (!favoriteGenres || favoriteGenres.length === 0) {
        return res.status(400).json({ message: "No favorite genres found for user" });
      }
  
      // Fetch the genre ObjectIds based on user's favorite genres
      const genreIds = await Genre.find({ name: { $in: favoriteGenres } }).select('_id');
  
      // Extract the genre ObjectIds from the result
      const genreObjectIds = genreIds.map((genre) => genre._id);
  
      // Fetch movies filtered by user's OTT subscriptions and favorite genres (ObjectIds)
      const recommendedMovies = await Movie.find({
        ottPresent: { $in: ottSubscribed }, // Match movies based on user's OTT subscriptions
        genre: { $in: genreObjectIds } // Match movies based on user's favorite genres (ObjectId)
      }).limit(20); // Limit to 20 recommendations
  
      // Return the filtered recommended movies
      res.json(recommendedMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  //const TMDB_API_KEY = 'e98bd45cd5f4806586201aacf183bdde';

// MOVIE LIST FROM TMDB API
const getMoviesForUserott = async (req, res) => {
    try {
      const filteredMovies = [];
  
      // Loop through multiple pages (adjust the number of pages as needed)
      for (let page = 25; page <= 40; page++) {
        // Fetch popular movies from TMDB API
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'en-US',
            page: page
          }
        });
  
        const movies = tmdbResponse.data.results;
  
        // Loop through each movie to check its OTT availability
        for (const movie of movies) {
          // Fetch watch providers for each movie
          const providersResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`, {
            params: {
              api_key: TMDB_API_KEY
            },
            timeout:5000
          });
  
          const availablePlatforms = providersResponse.data.results?.US?.flatrate || []; // Get available platforms
          const availablePlatformNames = availablePlatforms.map(provider => provider.provider_name);
          //console.log(availablePlatformNames)
          // Check if the movie is available on Hulu
          if (availablePlatforms.some(provider => provider.provider_name === 'Disney Plus')) {
            // Fetch additional movie details including the cast and genres
            const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
              params: {
                api_key: TMDB_API_KEY,
                append_to_response: 'credits' // Include cast details
              },
              timeout:5000
            });
  
            const detailedMovie = detailsResponse.data;
  
            // Check if the movie already exists in the database
            const existingMovie = await Movie.findOne({ name: detailedMovie.title, year: new Date(detailedMovie.release_date).getFullYear() });
  
            if (!existingMovie) { // If the movie doesn't exist
              // Process genres and save to database
              const genrePromises = detailedMovie.genres.map(async (genre) => {
                let existingGenre = await Genre.findOne({ name: genre.name });
                if (!existingGenre) {
                  // Create and save new genre if not exists
                  existingGenre = new Genre({ name: genre.name });
                  await existingGenre.save();
                }
                return existingGenre._id; // Return genre ID for saving
              });
  
              const genreIds = await Promise.all(genrePromises); // Get all genre IDs
  
              // Get the director's name and profile picture
              const director = detailedMovie.credits.crew.find(crewMember => crewMember.job === 'Director');
              const directorName = director ? director.name : 'Unknown';
              //const directorProfileImage = director && director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : 'No profile available';
              const directorDescription = `${directorName}`;
  
              // Prepare movie data to save
              const movieData = {
                name: detailedMovie.title,
                image: `https://image.tmdb.org/t/p/w500${detailedMovie.poster_path}`,
                year: new Date(detailedMovie.release_date).getFullYear(),
                genre: genreIds[0], // Use the first genre's ID; adjust as needed
                detail: detailedMovie.overview,
                cast: detailedMovie.credits.cast.map(castMember => castMember.name), // Include cast names
                numReviews: 0, // Default value; adjust as needed
                movieLink: detailedMovie.homepage || '',
                adultRating: detailedMovie.adult ? 'R' : 'PG-13',
                country: detailedMovie.production_countries[0]?.name || 'Unknown', // Get the country of production
                directorDescription: directorDescription, // Include director name and profile picture
                ottPresent:"Disney+" // Include available platforms in the response
              };
  
              // Save the movie to the database
              const newMovie = new Movie(movieData);
              await newMovie.save();
  
              // Add the saved movie to the filtered list
              filteredMovies.push(newMovie);
  
            
            }
          }
        }
  
        
      }
  
      // Return the filtered list of movies
      res.json(filteredMovies);
    } catch (error) {
      console.error('Error fetching movies from TMDb API:', error);
      res.status(500).json({ message: "Server error, please try again later.", errorDetails: error.message });
    }
  };
  
  
  
  
  export {createMovie,getMoviesForUser,getSpecificMovie,updateMovie,movieReview,deleteMovie,
    deleteComment,getNewMovies,getTopMovies,getRandomMovies,getRecommendedMovies,getAllMovies,
    getSpecificUserMovie,getMoviesForUserott,searchMovieInDatabaseAndApi};