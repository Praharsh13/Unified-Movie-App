import express from "express";
const router = express.Router();


import { createMovie,
    getMoviesForUser,
    getSpecificMovie,
    updateMovie,
    movieReview,
    deleteMovie,
    deleteComment,
    getNewMovies,
    getTopMovies,
getRandomMovies,
getRecommendedMovies,getAllMovies,getSpecificUserMovie, getMoviesForUserott, searchMovieInDatabaseAndApi} from "../controllers/movie.controller.js";

// Middlewares
import { userAuthentication,ifAdmin , attachUserIfPresent} from "../middlewares/auth.middleware.js";
import checkId from "../middlewares/checkId.js";
//Users
router.get("/user-movie",userAuthentication,getMoviesForUser);
router.get("/user-movie-search/:id",userAuthentication,getSpecificUserMovie);
router.get("/new-movies",userAuthentication, getNewMovies);
router.get("/top-movies",attachUserIfPresent, getTopMovies);
router.get("/random-movies",attachUserIfPresent, getRandomMovies);
router.get("/recomended-movies",attachUserIfPresent, getRecommendedMovies);
router.get("/user-movieall-search/:id", attachUserIfPresent,ifAdmin,getSpecificMovie);
router.get("/user-movieott",userAuthentication,getMoviesForUserott);
router.get("/user-movieottsearch/:title",attachUserIfPresent,searchMovieInDatabaseAndApi);
// Admin
router.post("/create-movie", userAuthentication, ifAdmin, createMovie);
router.put("/update-movie/:id", userAuthentication, ifAdmin, updateMovie);
router.delete("/delete-movie/:id", userAuthentication, ifAdmin, deleteMovie);
router.get("/all-movie", userAuthentication, ifAdmin, getAllMovies);

//Route for adding reviews
router.post("/:id/reviews", attachUserIfPresent, checkId, movieReview);
router.delete("/delete-comment", userAuthentication, ifAdmin, deleteComment);
export default router;