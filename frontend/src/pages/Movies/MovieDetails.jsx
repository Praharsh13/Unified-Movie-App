//This page show all the movie page details along with reviews of each movie.
//Responsive page to take different functionality.




//Importing all necessary modules

import { useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetUserSpecificMovieQuery,useAddMovieReviewMutation, useGetUserMoviesQuery } from "../../redux/api/movie";
import MovieTabs from "./MovieTabs";
import { Link } from "react-router-dom";
import { useAddToWishlistMutation } from "../../redux/api/wishlist";
import { useFetchGenresQuery } from "../../redux/api/genre";




const MovieDetails = () => {
    const { id: movieId } = useParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { data: movie, refetch } = useGetUserSpecificMovieQuery(movieId);
    const { userInfo } = useSelector((state) => state.auth);
    const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();
    const [addToWishlist] = useAddToWishlistMutation();
    const { data: genres } = useFetchGenresQuery();

    // Function to get genre name by ID
    const getGenreNameById = (genreId) => {
        if (!genreId || !genres) return "Unknown";
        const genre = genres?.find((g) => g?._id?.toString() === genreId?.toString());
        return genre ? genre.name : "Unknown";
    };

    // Submit review handler
    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({ id: movieId, rating, comment }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (error) {
            toast.error(error.data || error.message);
        }
    };

    // Handle adding movie to wishlist
    const handleAddToWishlist = async (movieId) => {
        try {
            await addToWishlist(movieId).unwrap();
            toast.success("Movie added to wishlist!");
        } catch (error) {
            toast.error("Failed to add movie to wishlist.");
        }
    };

    // OTT Platform logos mapping
    const platformLogos = {
        Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        Hulu: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
        "Amazon Prime": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
        "Disney+": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
        "HBO Max": "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
        "Apple TV+": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_TV_Plus_Logo.svg",
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8 bg-black text-white">
            {/* Go Back */}
            <div className="mb-6">
                <Link to="/" className="text-red-600 font-semibold hover:underline">
                    Go Back
                </Link>
            </div>

            {/* Movie Main Image and OTT Platforms */}
            <div className="relative flex justify-center items-center mb-8">
                <img
                    src={movie?.image}
                    alt={movie?.name}
                    className="w-[50%] h-[400px] object-cover rounded shadow-lg"
                />

                {/* OTT Platform Logos - Top Right */}
                <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                    {movie?.ottPresent?.map((ottPlatform) => (
                        <div key={ottPlatform} className="flex items-center mb-2">
                            <img
                                src={platformLogos[ottPlatform] || "https://via.placeholder.com/50x30.png?text=OTT"}
                                alt={ottPlatform}
                                className="w-10 h-10"
                            />
                        </div>
                    ))}
                </div>

                {/* Watch Now Button - Center with Play Button */}
                <div className="absolute inset-0 flex justify-center items-center">
                    <a
                        href={movie?.movieLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 bg-opacity-70 hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center transform hover:scale-105"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14.752 11.168l-5.504 3.168A1 1 0 018 13.432V10.57a1 1 0 01.248-.696l5.504-3.168a1 1 0 011.496.832v6.336a1 1 0 01-1.496.832z"
                            />
                        </svg>
                        Watch Now
                    </a>
                </div>
            </div>

            {/* Movie Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                {/* Movie Info */}
                <section>
                    <h2 className="text-4xl font-extrabold mb-4">{movie?.name}</h2>
                    <p className="text-gray-400 mb-6">{movie?.detail}</p>
                    <p className="text-lg my-2">Director: {movie?.directorDescription}</p>
                    <p className="text-lg my-2">Adult Rating: {movie?.adultRating}</p>
                    <p className="text-lg my-2">Genre: {getGenreNameById(movie?.genre)}</p>

                    {/* Add to Wishlist Button */}
                    <button
                        onClick={() => handleAddToWishlist(movie._id)}
                        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                    >
                        Add to Wishlist
                    </button>
                </section>

                {/* Cast and Release Date */}
                <div>
                    <p className="text-2xl font-semibold mb-4">Releasing Date: {movie?.year}</p>
                    <div className="text-lg font-semibold">Cast:</div>
                    {movie?.cast?.map((c, index) => (
                        <ul key={index} className="text-lg text-gray-300 mt-2">
                            <li>{c}</li>
                        </ul>
                    ))}
                </div>
            </div>

            {/* Review Form */}
            <div className="mb-8">
                <MovieTabs
                    loadingMovieReview={loadingMovieReview}
                    userInfo={userInfo}
                    submitHandler={submitHandler}
                    rating={rating}
                    setRating={setRating}
                    comment={comment}
                    setComment={setComment}
                    movie={movie}
                />
            </div>
        </div>
    );
};

export default MovieDetails;