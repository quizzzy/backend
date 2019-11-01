import express from "express";
import compression from "compression";  // compresses requests
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";


// Controllers (route handlers)
import * as homeController from "./controllers/home.controller";
import * as apiController from "./controllers/api.controller";

// Create Express server
const app = express();


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => {
        console.log("Connected to MongoDB ", MONGODB_URI);
    },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

/**
 * API examples routes.
 */
app.get("/api", apiController.getApi);

export default app;
