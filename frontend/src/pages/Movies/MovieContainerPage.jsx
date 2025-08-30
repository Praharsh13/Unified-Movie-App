import { useState,useEffect } from "react";
import { 
    useGetNewMoviesQuery,
    useGetTopMoviesQuery,
    useGetRandomMoviesQuery,
    useGetRecommendedMoviesQuery } 
from "../../redux/api/movie";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../components/SliderUtil";
import soundmp from "../../assets/sound.mp3"


const MoviesContainerPage = () => {
    const { data: newMovies } = useGetNewMoviesQuery();
    const { data: topMovies } = useGetTopMoviesQuery();
    const { data: genres } = useFetchGenresQuery();
    const { data: randomMovies } = useGetRandomMoviesQuery();
    const { data: recommendedMovies } = useGetRecommendedMoviesQuery();
    const [selectedGenre, setSelectedGenre] = useState(null);
  
    const playHoverSound = () => {
      const sound = new Audio(soundmp);
      sound.play();
    };
  
    const handleGenreClick = (genreId) => {
      setSelectedGenre(genreId);
      playHoverSound();
    };
  
    const filteredMovies = newMovies?.filter(
      (movie) => selectedGenre === null || movie.genre === selectedGenre
    );
  
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Header with Genre Navigation */}
        <header className="flex flex-wrap justify-center lg:justify-start items-center py-4 px-4 lg:px-12 bg-gradient-to-b from-gray-900 via-gray-800 to-transparent">
          {genres?.map((genre) => (
            <button
              key={genre._id}
              onClick={() => handleGenreClick(genre._id)}
              className={`mx-2 mb-2 px-3 lg:px-4 py-1 lg:py-2 rounded-full font-semibold text-sm lg:text-base transition duration-300 ease-in-out hover:bg-gray-700 hover:scale-105 ${
                selectedGenre === genre._id ? "bg-gray-800" : "bg-transparent"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </header>
  
        {/* Content Sections */}
        <section className="mt-6 lg:mt-8 space-y-10 px-4 lg:px-12">
          {/* Filtered Movies Section */}
          <div className="group" onMouseEnter={playHoverSound}>
            <h2 className="text-lg md:text-2xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-wide">Choose Movie</h2>
            <div className="transition-transform transform group-hover:scale-105">
              <SliderUtil data={filteredMovies} />
            </div>
          </div>  
  
          {/* Random Movies Section */}
          <div className="group" onMouseEnter={playHoverSound}>
            <h2 className="text-lg md:text-2xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-wide">Choose For You</h2>
            <div className="transition-transform transform group-hover:scale-105">
              <SliderUtil data={randomMovies} />
            </div>
          </div>
  
          {/* Top Movies Section */}
          <div className="group" onMouseEnter={playHoverSound}>
            <h2 className="text-lg md:text-2xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-wide">Top Movies</h2>
            <div className="transition-transform transform group-hover:scale-105">
              <SliderUtil data={topMovies} />
            </div>
          </div>
  
          {/* Recommended Movies Section */}
          <div className="group" onMouseEnter={playHoverSound}>
            <h2 className="text-lg md:text-2xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-wide">Recommended For You</h2>
            <div className="transition-transform transform group-hover:scale-105">
              <SliderUtil data={recommendedMovies} />
            </div>
          </div>
        </section>
      </div>
    );
};

export default MoviesContainerPage;