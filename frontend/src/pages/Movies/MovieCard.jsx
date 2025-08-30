import { Link } from "react-router-dom";
import hulu from "../../assets/hulu.jpeg"
import apple from "../../assets/apple.png"

// External URLs for OTT platform logos
const platformLogos = {
  "Netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "Hulu": hulu,
  "Amazon Prime": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
  "Disney+": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
  "HBO Max": "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
  "Apple TV+": apple,
};



// export default MovieCard;

const MovieCard = ({ movie }) => {
    // Define a fallback link if movieLink is not present
    const fallbackLink = movie.ottPresent?.[0] ? `https://www.${movie.ottPresent[0].toLowerCase().replace(' ', '')}.com` : "#";
  
    return (
      <div key={movie._id} className="relative group m-[2rem] transition-transform duration-300 ease-in-out transform hover:scale-105">
        <Link to={`/movies/${movie._id}`}>
          <img
            src={movie.image}
            alt={movie.name}
            className="w-[20rem] h-[20rem] rounded-lg m-0 p-0 transition duration-300 ease-in-out transform group-hover:opacity-70"
          />
        </Link>
  
        {/* Movie Name on Hover */}
        <p className="absolute bottom-[4rem] left-[2rem] right-0 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 text-white font-semibold text-lg">
          {movie.name}
        </p>
  
        {/* OTT Platforms Display */}
        <div className="absolute top-[5%] left-[5%] flex space-x-2 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
          {movie.ottPresent?.map((platform) => (
            <img
              key={platform}
              src={platformLogos[platform]}
              alt={platform}
              className="w-[2.5rem] h-[2.5rem] bg-gray-900 p-1 rounded-full"
              title={platform} // Tooltip showing platform name
            />
          ))}
        </div>
  
        {/* Watch Now Button */}
        <a
          href={movie.movieLink || fallbackLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[1rem] left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded text-sm opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"
        >
          Watch Now
        </a>
      </div>
    );
  };
  
  export default MovieCard;