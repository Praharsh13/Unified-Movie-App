import { apiSlice } from "./apiSlice";
import { WISHLIST_URL } from "../constant";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the user's wishlist
    getWishlist: builder.query({
      query: () => `${WISHLIST_URL}/`,  // Assuming your backend route for fetching wishlist is /wishlist
      providesTags: ["Wishlist"],  // Allows invalidating and refetching when needed
    }),
    
    // Add a movie to the wishlist
    addToWishlist: builder.mutation({
      query: (movieId) => ({
        url: `${WISHLIST_URL}/`,
        method: "POST",
        body: { movieId },  // Assuming you just need the movieId to add it to the wishlist
      }),
      invalidatesTags: ["Wishlist"],  // Invalidates cache and refetches wishlist after mutation
    }),
    
    // Remove a movie from the wishlist
    removeFromWishlist: builder.mutation({
      query: (movieId) => ({
        url: `${WISHLIST_URL}/${movieId}`,
        method: "DELETE",
        body: { movieId },  // Assuming movieId is sent in the request body to remove from the wishlist
      }),
      invalidatesTags: ["Wishlist"],  // Invalidates cache and refetches wishlist after mutation
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
