import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <div className="fixed h-screen w-64 bg-gradient-to-b from-gray-800 to-black text-white shadow-lg">
      <aside className="flex flex-col items-center py-6">
        <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
        <ul className="w-full">
          <li className="text-lg mb-4">
            <Link
              to="/admin/movies/dashboard"
              className="block w-full p-3 text-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 transition-transform"
            >
              Dashboard
            </Link>
          </li>
          <li className="text-lg mb-4">
            <Link
              to="/admin/movies/create"
              className="block w-full p-3 text-center rounded-lg bg-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 transition-all"
            >
              Create Movie
            </Link>
          </li>
          <li className="text-lg mb-4">
            <Link
              to="/admin/movies/genre"
              className="block w-full p-3 text-center rounded-lg bg-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 transition-all"
            >
              Create Genre
            </Link>
          </li>
          <li className="text-lg mb-4">
            <Link
              to="/admin/movies-list"
              className="block w-full p-3 text-center rounded-lg bg-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 transition-all"
            >
              Update Movie
            </Link>
          </li>
          <li className="text-lg">
            <Link
              to="/admin/movies/comments"
              className="block w-full p-3 text-center rounded-lg bg-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 transition-all"
            >
              Comments
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};


export default Sidebar;