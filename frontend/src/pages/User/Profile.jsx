import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";
//This is for updating the profile for user , all the data are going successfully
const Profile = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [ottSubscribed, setOttSubscribed] = useState([]);
    const [favoriteGenres, setFavoriteGenres] = useState([]);
  
    const { userInfo } = useSelector((state) => state.auth);
  
    const [updateUserProfile, { isLoading: loadingUpdateProfile }] =
      useProfileMutation();
  
    useEffect(() => {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
      setOttSubscribed(userInfo.ottSubscribed || []);
      setFavoriteGenres(userInfo.favoriteGenres || []);
    }, [userInfo]);
  
    const dispatch = useDispatch();
  
    const handleOttChange = (e) => {
      const value = e.target.value;
      setOttSubscribed((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    };
  
    const handleGenreChange = (e) => {
      const value = e.target.value;
      setFavoriteGenres((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    };
  
    const submitHandler = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      try {
        const res = await updateUserProfile({
          _id: userInfo._id,
          username,
          email,
          password,
          ottSubscribed,
          favoriteGenres,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };
  
    return (
      <div className="min-h-screen flex">
        {/* Left side: Background with movie image */}
        <div className="hidden md:flex w-1/2 bg-cover bg-center relative"
             style={{ backgroundImage: `url('https://as2.ftcdn.net/v2/jpg/02/08/79/83/1000_F_208798343_jF6MSL4ilCJEbdf3JHCXwMhvNDirGZiq.jpg')` }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-6">
          <div className="flex justify-center align-center md:flex md:space-x-4">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 shadow-lg">
             Profile Updation in process {username}
          </h1>
        </div>
            <p className="text-lg">Search and track your favorite movies from various OTT platforms!</p>
          </div>
        </div>
  
        {/* Right side: Profile form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-900 px-8 py-16">
          <h2 className="text-3xl text-white font-semibold mb-6">Update Profile</h2>
  
          <form onSubmit={submitHandler} className="w-full max-w-lg">
            <div className="mb-4">
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="form-input bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-white mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
  
            {/* OTT Subscriptions */}
            <div className="mb-4">
              <label className="block text-white mb-2">OTT Subscriptions</label>
              <select
                value={ottSubscribed}
                onChange={handleOttChange}
                multiple
                className="form-select bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Netflix">Netflix</option>
                <option value="Amazon Prime">Amazon Prime</option>
                <option value="Hulu">Hulu</option>
                <option value="Disney+">Disney+</option>
                <option value="HBO Max">HBO Max</option>
                <option value="Apple TV+">Apple TV+</option>
              </select>
            </div>
  
            {/* Favorite Genres */}
            <div className="mb-4">
              <label className="block text-white mb-2">Favorite Genres</label>
              <select
                value={favoriteGenres}
                onChange={handleGenreChange}
                multiple
                className="form-select bg-gray-800 text-white border border-gray-700 p-4 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Romance">Romance</option>
                <option value="Documentary">Documentary</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
  
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-red-600 text-white font-bold py-3 px-6 rounded hover:bg-red-700 w-full"
              >
                Update Profile
              </button>
  
              {loadingUpdateProfile && <Loader />}
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Profile;
