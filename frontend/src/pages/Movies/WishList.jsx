import React from "react";
import { useGetWishlistQuery,useRemoveFromWishlistMutation } from "../../redux/api/wishlist";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";  // Optional spinner for loading state
import wishlistBg from "../../assets/wishlistBg.avif"


// export default WishList;
const WishList = () => {
    // Fetching wishlist data
    const { data: wishlist, isLoading, isError, refetch } = useGetWishlistQuery();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
  
    if (isLoading) return <Loader />; // Show loader while loading
    if (isError) return <p className="text-red-500 text-center mt-10">Failed to load wishlist.</p>;
  
    // Handling movie removal from wishlist
    const handleRemove = async (movieId) => {
      try {
        await removeFromWishlist(movieId).unwrap();
        refetch(); // Refetch the wishlist after removing
      } catch (error) {
        console.error("Failed to remove movie from wishlist", error);
      }
    };
  
    return (
      <div
        className="min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${wishlistBg})` }} // Background image
      >
        <div className="bg-black bg-opacity-70 min-h-screen py-12 px-4">
          <h1 className="text-5xl font-bold text-center mb-12 text-white">Your Wishlist</h1>
  
          {wishlist?.movies?.length === 0 ? (
            <p className="text-center text-gray-300 text-2xl">Your wishlist is empty. Start adding movies!</p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-screen-lg mx-auto">
              {wishlist?.movies?.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-gray-900 bg-opacity-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="p-5">
                    <h2 className="text-2xl font-semibold mb-2 truncate">{movie.name}</h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{movie.detail}</p>
  
                    {/* Action buttons */}
                    <div className="flex justify-between items-center">
                      <Link
                        to={movie.movieLink}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-center text-white font-bold py-2 px-4 rounded mr-2 transition duration-200"
                      >
                        Watch Now
                      </Link>
                      <button
                        onClick={() => handleRemove(movie._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-center text-white font-bold py-2 px-4 rounded transition duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default WishList;
