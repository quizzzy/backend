import express from "express";
import compression from "compression"; // compresses requests
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { MONGODB_URI } from "./util/secrets";
import { setupDatabase } from "./util/database";

/**
 * Middelwares
 */
import cors from "./middlewares/cors";

// Controllers (route handlers)
import * as quizController from "./controllers/quiz.controller";
import * as adminController from "./controllers/quiz.controller";
import * as questionsController from "./controllers/questions.controller";
import * as answersController from "./controllers/answers.controller";
import * as scalesController from "./controllers/scales.controller";
import * as scaleCategoriesController from "./controllers/scale-categories.controller";
import * as profilesController from "./controllers/profiles.controller";
import * as usersController from "./controllers/users.controller";

// Create Express server
const app = express();

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB ", MONGODB_URI);
		setupDatabase();
	})
	.catch(err => {
		console.log(
			"MongoDB connection error. Please make sure MongoDB is running. " + err
		);
		// process.exit();
	});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(cors);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get("/quiz", quizController.index);
app.get("/admin", adminController.index);

/**
 * API routes.
 */
app.get("/api/questions", questionsController.getQuestions);
app.get("/api/questions/:id", questionsController.getQuestion);

app.get("/api/answers", answersController.getAnswers);
// app.get("/api/answer/:id", answersController.getAnswer);
// app.post("/api/answer/:id", answersController.postAnswer);

// app.get("/api/scale", scalesController.getScales);
// app.get("/api/scale/:id", scalesController.getScale);
// app.post("/api/scale/:id", scalesController.postScale);

// app.get("/api/scale-category", scaleCategoriesController.getScaleCategories);
// app.post("/api/scale-category/:id", scaleCategoriesController.postScaleCategory);
// app.post("/api/scale-category/:id", scaleCategoriesController.postScaleCategory);

app.get("/api/profiles", profilesController.getProfiles);
app.get("/api/profiles/:id", profilesController.getProfile);
app.post("/api/profiles", profilesController.postProfile);

// app.get("/api/user", usersController.getUsers);
// app.get("/api/user/:id", usersController.getUser);
// app.post("/api/user/:id", usersController.postUser);

export default app;
