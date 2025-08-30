import { apiSlice } from "./apiSlice";
import { MOVIE_URL,UPLOAD_URL } from "../constant";

export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserMovies: builder.query({
      query: () => `${MOVIE_URL}/user-movie`,
    }),
    getAllMovies: builder.query({
        query: () => `${MOVIE_URL}/all-movie`,
      }),
    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: "http://localhost:3002/movieapp/movies/create-movie",
        method: "POST",
        body: newMovie,
      }),
    }),

    updateMovie: builder.mutation({
      query: ({ id, updatedMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: "PUT",
        body: updatedMovie,
      }),
    }),

    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, id, comment },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment`,
        method: "DELETE",
        body: { movieId, reviewId },
      }),
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: "DELETE",
      }),
    }),

    getSpecificMovie: builder.query({
      query: (id) => `${MOVIE_URL}/user-movieall-search/${id}`,
    }),
    getUserSpecificMovie: builder.query({
        query: (id) => `${MOVIE_URL}/user-movie-search/${id}`,
      }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}/`,
        method: "POST",
        body: formData,
      }),
    }),

    getNewMovies: builder.query({
      query: () => `${MOVIE_URL}/new-movies`,
    }),

    getTopMovies: builder.query({
      query: () => `${MOVIE_URL}/top-movies`,
    }),

    getRandomMovies: builder.query({
      query: () => `${MOVIE_URL}/random-movies`,
    }),

    getRecommendedMovies: builder.query({
        query: () => `${MOVIE_URL}/recomended-movies`,
      }),
  }),
});

export const {
  useGetAllMoviesQuery,
  useGetUserMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useAddMovieReviewMutation,
  useDeleteCommentMutation,
  useGetSpecificMovieQuery,
  useGetUserSpecificMovieQuery,
  useUploadImageMutation,
  useDeleteMovieMutation,
  //Dashboard
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
  useGetRecommendedMoviesQuery
} = moviesApiSlice;