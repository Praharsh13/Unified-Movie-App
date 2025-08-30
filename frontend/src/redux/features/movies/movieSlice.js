import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    moviesFilter: {
      searchTerm: "",
      selectedGenre: "",
      selectedYear: "",
      selectedSort: [],
      ottSubscribed: [], // New field to track OTT subscriptions
    },

    filteredMovies: [],
    movieYears: [],
    uniqueYear: [],
  },

  reducers: {
    setMoviesFilter: (state, action) => {
      state.moviesFilter = { ...state.moviesFilter, ...action.payload };
    },

    setFilteredMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },

    setMovieYears: (state, action) => {
      state.movieYears = action.payload;
    },

    setUniqueYears: (state, action) => {
      state.uniqueYear = action.payload;
    },

    setOttSubscribed: (state, action) => {
      state.moviesFilter.ottSubscribed = action.payload; // Update OTT filter
    },
  },
});

export const {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
  setOttSubscribed, // Export the new action
} = moviesSlice.actions;

export default moviesSlice.reducer;
