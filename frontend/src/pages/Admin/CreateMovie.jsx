import { useCreateMovieMutation,useUploadImageMutation } from "../../redux/api/movie";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const ottPlatforms = ['Netflix', 'Amazon Prime', 'Hulu', 'Disney+', 'HBO Max', 'Apple TV+'];

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
    country: "",
    directorDescription: "",
    adultRating: "",
    ottPresent: [],
    movieLink: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleOttChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setMovieData((prevData) => ({
      ...prevData,
      ottPresent: selectedOptions,
    }));
  };

  const handleCreateMovie = async () => {
    try {
      if (
        !movieData.name ||
        !movieData.year ||
        !movieData.detail ||
        !movieData.cast.length ||
        !selectedImage
      ) {
        toast.error("Please fill all required fields");
        return;
      }
  
      let uploadedImagePath = null;
  
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
  
        const uploadImageResponse = await uploadImage(formData);
  
        if (uploadImageResponse.error) {
          toast.error("Failed to upload image");
          console.error(uploadImageResponse.error);
          return;
        }
  
        uploadedImagePath = uploadImageResponse.data.image;
      }
  
      const createMovieResponse = await createMovie({
        ...movieData,
        image: uploadedImagePath,
      });
  
      if (createMovieResponse.error) {
        toast.error(`Failed to create movie: ${createMovieResponse.error}`);
        console.error(createMovieResponse.error);
      } else {
        navigate("/admin/movies-list");
        toast.success("Movie Added To Database");
      }
    } catch (error) {
      console.error("Error during movie creation:", error);
      toast.error("Error during movie creation.");
    }
  };

  return (
    <div className="container flex justify-center items-center mt-4 bg-black min-h-screen p-6">
      <form className="w-full max-w-lg bg-gray-800 p-6 rounded-md shadow-lg">
        <h2 className="text-red-600 text-3xl font-bold mb-6">Create Movie</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={movieData.name}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Year */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Year:</label>
          <input
            type="number"
            name="year"
            value={movieData.year}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Detail */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Detail:</label>
          <textarea
            name="detail"
            value={movieData.detail}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>

        {/* Movie Link */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Movie Link:</label>
          <input
            type="text"
            name="movieLink"
            value={movieData.movieLink}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Cast */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Cast (comma-separated):</label>
          <input
            type="text"
            name="cast"
            value={movieData.cast.join(", ")}
            onChange={(e) =>
              setMovieData({ ...movieData, cast: e.target.value.split(", ") })
            }
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Genre:</label>
          <select
            name="genre"
            value={movieData.genre}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          >
            {isLoadingGenres ? (
              <option>Loading genres...</option>
            ) : (
              genres.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Country */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Country:</label>
          <input
            type="text"
            name="country"
            value={movieData.country}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* Director Description */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Director Description:</label>
          <textarea
            name="directorDescription"
            value={movieData.directorDescription}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>

        {/* Adult Rating */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">Adult Rating:</label>
          <input
            type="text"
            name="adultRating"
            value={movieData.adultRating}
            onChange={handleChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        {/* OTT Platforms */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">OTT Platforms:</label>
          <select
            name="ottPresent"
            multiple
            value={movieData.ottPresent}
            onChange={handleOttChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          >
            {ottPlatforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">
            {selectedImage ? "Image Uploaded" : "Upload Image"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-gray-700 text-white border-2 border-gray-600 rounded-md px-3 py-2 w-full"
          />
        </div>

        <button
          type="button"
          onClick={handleCreateMovie}
          className="bg-red-600 text-white px-4 py-2 rounded-md w-full mt-4 hover:bg-red-700 transition duration-200"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
