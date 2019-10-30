import express from "express";
import compression from "compression";  // compresses requests

// Controllers (route handlers)
import * as homeController from "./controllers/home.controller";
import * as apiController from "./controllers/api.controller";

// Create Express server
const app = express();

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
