import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movie";
import hullu from "../../assets/hullu.png"
import apple from "../../assets/apple.png"



// Mapping OTT platforms to logo URLs
const ottLogos = {
    'Netflix': "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    'Amazon Prime': "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    'Hulu': hullu,
    'Disney+': "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    'HBO Max': "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    'Apple TV+': apple,
  };
  
  const AdminMoviesList = () => {
    const { data: movies } = useGetAllMoviesQuery();
  
    return (
      <div className="container mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white">All Movies ({movies?.length})</h1>
        </div>
  
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {movies?.map((movie) => (
            <Link
              key={movie._id}
              to={`/admin/movies/update/${movie._id}`}
              className="block group rounded-lg overflow-hidden shadow-lg bg-gray-800 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Movie Poster */}
              <div className="relative">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {/* OTT Platform Logos */}
                <div className="absolute bottom-0 right-0 flex p-2 space-x-2 bg-black/70 backdrop-blur-sm rounded-tl-lg">
                  {movie.ottPresent.map((platform) => (
                    <img
                      key={platform}
                      src={ottLogos[platform]} // Display corresponding logo using URL
                      alt={platform}
                      className="w-8 h-8 object-contain"
                      style={{ filter: "brightness(0) invert(1)" }} // Logo style for visibility on dark background
                    />
                  ))}
                </div>
              </div>
  
              {/* Movie Info */}
              <div className="p-4 bg-gray-900 text-white">
                <h2 className="text-lg font-semibold truncate">{movie.name}</h2>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{movie.detail}</p>
                <div className="mt-4">
                  <Link
                    to={`/admin/movies/update/${movie._id}`}
                    className="block bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-center"
                  >
                    Update Movie
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  export default AdminMoviesList;