import express from "express";
const genrerouter = express.Router();

//Controllers

import { createGenre,updateGenre,removeGenre,listGenres,readGenre } from "../controllers/genre.controller.js";


//Middleware
import { userAuthentication,ifAdmin } from "../middlewares/auth.middleware.js";


//1.Router to create Genre
genrerouter.route("/").post(userAuthentication,ifAdmin,createGenre);
//2.Router to update Genre
genrerouter.route("/:id").post(userAuthentication, ifAdmin, updateGenre);
genrerouter.route("/:id").delete(userAuthentication, ifAdmin, removeGenre);
genrerouter.route("/genrelist").get(listGenres);
genrerouter.route("/:id").get(readGenre);





export default genrerouter;