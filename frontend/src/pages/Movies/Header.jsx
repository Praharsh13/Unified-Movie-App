import SliderUtil from "../../components/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movie";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  return (
    <div className="flex flex-col mt-[1rem] ml-[auto] md:flex-row justify-between items-start text-white bg-gradient-to-r from-black via-gray-900 to-black p-4">
      {/* Navigation */}
      <nav className="w-full md:w-[10rem] ml-0 md:ml-2 mb-4 md:mb-0">
        <Link
          to="/"
          className="transition duration-300 ease-in-out block p-2 rounded mb-1 md:mb-2 text-lg hover:text-red-600 hover:scale-105"
          style={{ borderBottom: "2px solid transparent" }}
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="transition duration-300 ease-in-out block p-2 rounded mb-1 md:mb-2 text-lg hover:text-red-600 hover:scale-105"
          style={{ borderBottom: "2px solid transparent" }}
        >
          Browse Movies
        </Link>
        <Link
          to="/wishlist"
          className="transition duration-300 ease-in-out block p-2 rounded mb-1 md:mb-2 text-lg hover:text-red-600 hover:scale-105"
          style={{ borderBottom: "2px solid transparent" }}
        >
          Wishlist
        </Link>
      </nav>

      {/* Movie Slider */}
      <div className="w-full md:w-[80%] mr-0 md:mr-2">
        <SliderUtil data={data} />
      </div>
    </div>
  );
};

export default Header;
