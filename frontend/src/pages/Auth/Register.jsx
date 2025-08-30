import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/users";
import { toast } from "react-toastify";

const OTT_PLATFORMS = ['Netflix', 'Amazon Prime', 'Hulu', 'Disney+', 'HBO Max', 'Apple TV+'];
const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Kids'];

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ottSubscribed, setOttSubscribed] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const res = await register({ username, email, password, ottSubscribed, favoriteGenres }).unwrap();
      dispatch(setCredentials({ ...res }));

      console.log("User successfully registered:", {
        username,
        email,
        password,
        ottSubscribed,
        favoriteGenres,
      });
      
      navigate(redirect);
      toast.success("User successfully registered.");
    } catch (err) {
      console.error(err);
      
      if (err.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (err.status === 400) {
        toast.error("Bad request. Please check your input.");
      } else if (err.data && err.data.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    }
  };

  const handleOttChange = (platform) => {
    setOttSubscribed((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleGenreChange = (genre) => {
    setFavoriteGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-no-repeat relative bg-black bg-opacity-70" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
      <div className="bg-black bg-opacity-80 p-8 rounded-lg w-full max-w-lg text-white">
        <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {password && (
            <>
              {/* OTT Platforms */}
              <div>
                <h2 className="text-lg font-medium mb-2">Select OTT Platforms</h2>
                <div className="flex flex-wrap gap-3">
                  {OTT_PLATFORMS.map((platform) => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input type="checkbox" value={platform} onChange={() => handleOttChange(platform)} className="form-checkbox text-red-600 bg-gray-700" />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Favorite Genres */}
              <div>
                <h2 className="text-lg font-medium mb-2">Select Favorite Genres</h2>
                <div className="flex flex-wrap gap-3">
                  {GENRES.map((genre) => (
                    <label key={genre} className="flex items-center space-x-2">
                      <input type="checkbox" value={genre} onChange={() => handleGenreChange(genre)} className="form-checkbox text-red-600 bg-gray-700" />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4 text-center">
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-red-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
