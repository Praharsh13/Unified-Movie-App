import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-10 left-[50%] transform -translate-x-1/2 z-50 bg-gradient-to-r from-[#0f0f0f] to-[#3a3a3a] border border-gray-700 shadow-lg w-[35%] px-[4rem] py-4 rounded-lg">
      <section className="flex justify-between items-center">
        {/* Section 1 */}
        <div className="flex justify-center items-center">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineHome className="mr-2 text-white" size={30} />
            <span className="hidden nav-item-name text-white">Home</span>
          </Link>

          <Link
            to="/movies"
            className="flex items-center transition-transform transform hover:translate-x-2 ml-[1.5rem]"
          >
            <MdOutlineLocalMovies className="mr-2 text-white" size={30} />
            <span className="hidden nav-item-name text-white">Movies</span>
          </Link>
        </div>

        {/* Section 2 */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-white font-semibold focus:outline-none"
          >
            {userInfo ? (
              <span className="text-white">{userInfo.username}</span>
            ) : (
              <></>
            )}

            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-1 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 w-[12rem] bg-white text-gray-800 rounded-lg shadow-md transition-transform transform ${
                !userInfo.isAdmin ? "-top-20" : "-top-28"
              }`}
            >
              {userInfo.isAdmin && (
                <li>
                  <Link
                    to="/admin/movies/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>

              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {/* Not Logged In */}
          {!userInfo && (
            <ul className="flex">
              <li>
                <Link
                  to="/login"
                  className="flex items-center transition-transform transform hover:translate-x-2 mb-[2rem] text-white"
                >
                  <AiOutlineLogin className="mr-2 mt-[4px]" size={30} />
                  <span className="hidden nav-item-name">LOGIN</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="flex items-center transition-transform transform hover:translate-x-2 ml-[1rem] text-white"
                >
                  <AiOutlineUserAdd size={30} />
                  <span className="hidden nav-item-name">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
