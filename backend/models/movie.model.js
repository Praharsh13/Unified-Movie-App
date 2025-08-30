import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// Review Schema
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Movie Schema
const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    year: { type: Number, required: true },
    genre: { type: ObjectId, ref: "Genre", required: true },
    detail: { type: String, required: true },
    cast: [{ type: String }],
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    // New fields
    movieLink: { type: String }, // Link to the movie
    adultRating: { type: String }, // E.g., "PG-13", "R" (string type)
    country: { type: String }, // Country of production
    directorDescription: { type: String }, // Description of the director
    ottPresent: [{ type: String }], // Array of OTT platforms the movie is available on
    //releaseDate: { type: Date }, // Release date of the movie
    duration: { type: String }, // Date the movie is available on the platform
    dateAdded: { type: Date, default: Date.now }, // Date added to the database
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
