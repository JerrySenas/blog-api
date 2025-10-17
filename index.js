import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import esMain from "es-main";

import { errorHandler } from "./errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));

if (esMain(import.meta)) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}.`);
    });
}
