import { useGetUserMoviesQuery } from "../../redux/api/movie";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { useGetNewMoviesQuery,useGetRandomMoviesQuery,useGetTopMoviesQuery } from "../../redux/api/movie";
import MovieCard from "./MovieCard";
import { useEffect } from "react";
import { useState } from "react";
//import { UseSelector } from "react-redux";
import banner from "../../assets/banner.jpeg";
import { setMoviesFilter,setFilteredMovies,setMovieYears,setOttSubscribed,setUniqueYears } from "../../redux/features/movies/movieSlice";
import { useSelector, useDispatch } from "react-redux";
//import axios from 'axios';
import soundEffect from "../../assets/soundEffect.mp3"
import searchEffect from "../../assets/searchIcon.jpg"

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;



const AllMovies = () => {
    const dispatch = useDispatch();
    const { data } = useGetUserMoviesQuery();
    const { data: genres } = useFetchGenresQuery();
    const { data: newMovies } = useGetNewMoviesQuery();
    const { data: topMovies } = useGetTopMoviesQuery();
    const { data: randomMovies } = useGetRandomMoviesQuery();
    
    const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);
    const { userInfo } = useSelector((state) => state.auth); 
    const [searchTerm, setSearchTerm] = useState("");
  
    const movieYears = data?.map((movie) => movie.year);
    const uniqueYears = Array.from(new Set(movieYears));
  
    useEffect(() => {
      dispatch(setFilteredMovies(data || []));
      dispatch(setMovieYears(movieYears));
      dispatch(setUniqueYears(uniqueYears));
      
      // Play opening sound effect
      const audio = new Audio(soundEffect);
      audio.play();
    }, [data, dispatch]);
  

     

const handleSearchChange = (e) => {
  const searchValue = e.target.value || searchTerm;
  setSearchTerm(searchValue);
  dispatch(setMoviesFilter({ searchTerm: searchValue }));

  if (!searchValue) {
    // If there's no search term, reset to show all movies
    dispatch(setFilteredMovies(data || []));
    return;
  }

  // Perform the search within the local `data` array
  const filteredLocalMovies = data.filter((movie) =>
    movie.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Update the filtered movies state
  dispatch(setFilteredMovies(filteredLocalMovies));
};
    const handleVoiceSearch = () => {
      if (!recognition) {
        console.error("Browser does not support Speech Recognition.");
        return;
      }
  
      recognition.start();
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        dispatch(setMoviesFilter({ searchTerm: transcript }));
  
        const filteredMovies = data.filter((movie) =>
          movie.name.toLowerCase().includes(transcript.toLowerCase())
        );
        
        dispatch(setFilteredMovies(filteredMovies));
      };
  
      recognition.onerror = (event) => {
        console.error("Speech Recognition error", event.error);
      };
    };
  
    const handleGenreClick = (genreId) => {
      const filterByGenre = data.filter((movie) => movie.genre === genreId);
      dispatch(setFilteredMovies(filterByGenre));
    };
  
    const handleYearChange = (year) => {
      const filterByYear = data.filter((movie) => movie.year === +year);
      dispatch(setFilteredMovies(filterByYear));
    };
  
    const handleSortChange = (sortOption) => {
      switch (sortOption) {
        case "new":
          dispatch(setFilteredMovies(newMovies));
          break;
        case "top":
          dispatch(setFilteredMovies(topMovies));
          break;
        case "random":
          dispatch(setFilteredMovies(randomMovies));
          break;
        default:
          dispatch(setFilteredMovies([]));
          break;
      }
    };
  
    const handleOttChange = (ott) => {
      if (!ott) {
        dispatch(setFilteredMovies(data || []));
        return;
      }
    
      if (data) {
        const filterByOtt = data.filter((movie) => {
          if (!movie.ottPresent || !Array.isArray(movie.ottPresent)) {
            return false; // Exclude this movie
          }
          return movie.ottPresent.map(ott => ott.toLowerCase()).includes(ott.toLowerCase());
        });
        
        dispatch(setFilteredMovies(filterByOtt));
      }
    };
  
    return (
      <div className="relative flex flex-col items-center bg-black text-white min-h-screen">
        <div
          className="w-full h-[45rem] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h1 className="text-7xl font-bold mb-4">The Movies Hub</h1>
            <p className="text-2xl mb-10">Cinematic Odyssey: Unveiling the Magic of Movies</p>
            <div className="relative w-2/3 flex items-center">
              <input
                type="text"
                className="w-full h-16 px-16 text-black outline-none rounded-full shadow-lg text-xl transition-transform duration-300 transform hover:scale-105 focus:scale-105"
                placeholder="Search Movie"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(""); // Clear the search input after pressing Enter
                  }
                }}
              />
              <button
                onClick={handleVoiceSearch}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 text-2xl text-gray-500 hover:text-gray-900 transition-all duration-200"
                title="Search by Voice"
              >
                🎤
              </button>
            </div>
          </div>
        </div>
  
        <div className="mt-12 w-4/5 flex justify-between items-center bg-gray-900 rounded-lg p-6 shadow-lg">
          <select
            className="w-1/4 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            value={moviesFilter.selectedGenre}
            onChange={(e) => handleGenreClick(e.target.value)}
          >
            <option value="">Genres</option>
            {genres?.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
  
          <select
            className="w-1/4 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            value={moviesFilter.selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
          >
            <option value="">Year</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
  
          <select
            className="w-1/4 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            value={moviesFilter.selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="new">New Movies</option>
            <option value="top">Top Movies</option>
            <option value="random">Random Movies</option>
          </select>
  
          <select
            className="w-1/4 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 "
            value={moviesFilter.selectedOtt}
            onChange={(e) => handleOttChange(e.target.value)}
          >
            <option value="">OTT Platforms</option>
            {userInfo?.ottSubscribed?.map((ottPlatform) => (
              <option key={ottPlatform} value={ottPlatform}>
                {ottPlatform}
              </option>
            ))}
          </select>
        </div>
  
        <section className="mt-12 w-full flex justify-center items-center flex-wrap px-12">
          {filteredMovies?.length === 0 ? (
            <div className="text-4xl text-center text-gray-500">No movie found for the given search criteria.</div>
          ) : (
            filteredMovies?.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          )}
        </section>
      </div>
    );
  };
  
  export default AllMovies;