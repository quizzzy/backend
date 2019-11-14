"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const answer_model_1 = require("../models/answer.model");
const question_model_1 = require("../models/question.model");
const scale_category_model_1 = require("../models/scale-category.model");
const scale_model_1 = require("../models/scale.model");
const user_model_1 = require("../models/user.model");
const answers_1 = require("../data/answers");
const questions_1 = require("../data/questions");
const scale_categories_1 = require("../data/scale-categories");
const scales_1 = require("../data/scales");
const admin = {
    login: "admin",
    password: "nimda"
};
exports.setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Drop existing collections");
    yield exports.dropCollectionsIfExists(answer_model_1.Answer, question_model_1.Question, scale_model_1.Scale, scale_category_model_1.ScaleCategory, user_model_1.User);
    console.log("Setup default database data");
    const savedAnswers = yield saveModelsWithPromise(answer_model_1.Answer, answers_1.answers);
    const answerIds = getIdsFromElementsArray(savedAnswers);
    questions_1.questions.forEach((question) => (question.answers = answerIds));
    const savedQuestions = yield saveModelsWithPromise(question_model_1.Question, questions_1.questions);
    const questionIds = getIdsFromElementsArray(savedQuestions);
    const savedScaleCategories = yield saveModelsWithPromise(scale_category_model_1.ScaleCategory, scale_categories_1.scaleCategories);
    const scaleCategoriesIds = getIdsFromElementsArray(savedScaleCategories);
    scales_1.scales.forEach((scale) => {
        const questions = [];
        scale.questions.forEach((questionIndex) => questions.push(questionIds[questionIndex - 1]));
        scale.categories.forEach((category, index) => (category.categoryId = scaleCategoriesIds[index]));
        scale.questions = questions;
    });
    const savedScales = yield saveModelsWithPromise(scale_model_1.Scale, scales_1.scales);
    const savedUser = yield saveModelWithPromise(user_model_1.User, admin);
    console.log("savedUser", savedUser);
});
exports.dropCollectionsIfExists = (...models) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < models.length; i++) {
        const list = yield models[i].db.db
            .listCollections({
            name: models[i].collection.name
        })
            .toArray();
        if (list.length > 0) {
            yield models[i].collection.drop();
            console.log("drop", list[0].name);
        }
    }
});
function saveModelWithPromise(Model, data) {
    return new Promise((res, rej) => {
        new Model(data).save((err, data) => {
            if (err)
                rej(err);
            res(data);
        });
    });
}
exports.saveModelWithPromise = saveModelWithPromise;
function saveModelsWithPromise(Model, dataArray) {
    const promises = [];
    dataArray.forEach(data => promises.push(saveModelWithPromise(Model, data)));
    return Promise.all(promises);
}
exports.saveModelsWithPromise = saveModelsWithPromise;
function getIdsFromElementsArray(elements) {
    const ids = [];
    elements.forEach((element) => ids.push(element.id));
    return ids;
}
exports.getIdsFromElementsArray = getIdsFromElementsArray;
//# sourceMappingURL=database.js.map