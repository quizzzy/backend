"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./util/secrets");
const database_1 = require("./util/database");
const with_auth_1 = __importDefault(require("./middlewares/with-auth"));
/**
 * Middelwares
 */
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Controllers (route handlers)
const quizController = __importStar(require("./controllers/quiz.controller"));
const adminController = __importStar(require("./controllers/admin.controller"));
const questionsController = __importStar(require("./controllers/questions.controller"));
const answersController = __importStar(require("./controllers/answers.controller"));
const profilesController = __importStar(require("./controllers/profiles.controller"));
const scalesController = __importStar(require("./controllers/scales.controller"));
// Create Express server
const app = express_1.default();
mongoose_1.default
    .connect(secrets_1.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected to MongoDB ', secrets_1.MONGODB_URI);
    database_1.setupDatabase();
})
    .catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    // process.exit();
});
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(cors_1.default());
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public/quiz/build')));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public/admin/build')));
/**
 * Primary app routes.
 */
app.get('/', quizController.index);
app.get('/admin', adminController.index);
app.get('/admin/statistics', adminController.getStatistics);
app.post('/admin/login', adminController.login);
app.post('/admin/logout', adminController.logout);
app.get('/admin/check-token', with_auth_1.default, adminController.checkToken);
/**
 * API routes.
 */
app.get('/api/questions', questionsController.getQuestions);
app.get('/api/questions/:id', questionsController.getQuestion);
app.get('/api/answers', answersController.getAnswers);
app.get('/api/scales', scalesController.getScales);
app.get('/api/profiles', profilesController.getProfiles);
app.get('/api/profiles/:id', profilesController.getProfile);
app.post('/api/profiles', profilesController.postProfile);
exports.default = app;
//# sourceMappingURL=app.js.map