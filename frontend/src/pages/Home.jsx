import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Movies/Header';
import MoviesContainerPage from './Movies/MovieContainerPage';
import { Link } from 'react-router-dom';

const Home = () => {
    // Access the authentication state from the Redux store
    // Header for each movie and MovieContainerapp 
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <>
            {isAuthenticated ? (
                <>
                    <Header />
                    <section className="mt-[1rem]">
                        <MoviesContainerPage />
                    </section>
                </>
            ) : (
                // Effect if user is not signin
                <div
                    className="relative flex justify-center items-center h-screen bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQwGw_KWolgRswjn96jRs8a5Wct7u4pxESUA&s')`,
                    }}
                >
                    
                    <div className="absolute inset-0 bg-black bg-opacity-70"></div>

                    
                    <div className="relative z-10 text-white text-center p-8">
                        {/* Welcome Title */}
                        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
                            Welcome to Movie App
                        </h1>
                        <p className="text-lg font-light mb-8">
                            Search all movies from your favourite OTT platforms in one place.
                        </p>

                        {/* Login and Register Buttons */}
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="bg-red-600 hover:bg-red-800 transition-all duration-300 text-white font-bold py-3 px-6 rounded-full shadow-md hover:scale-105"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gray-700 hover:bg-gray-900 transition-all duration-300 text-white font-bold py-3 px-6 rounded-full shadow-md hover:scale-105"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Fun Movie Facts with slight opacity */}
                        <div className="text-gray-300 mt-12 opacity-80">
                            <h3 className="text-xl font-semibold mb-4">Did you know?</h3>
                            <ul className="list-disc list-inside">
                                <li className="mb-2">
                                    The longest film ever made is "Logistics," which runs for 35 days.
                                </li>
                                <li className="mb-2">
                                    The iconic "Wilhelm Scream" has been used in over 400 movies.
                                </li>
                                <li className="mb-2">
                                    "Pirates of the Caribbean: On Stranger Tides" had a massive $375 million budget.
                                </li>
                                <li className="mb-2">In "Pulp Fiction," all the clocks are set to 4:20.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;