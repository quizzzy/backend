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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_model_1 = require("../models/profile.model");
const database_1 = require("../util/database");
const answer_model_1 = require("../models/answer.model");
const scale_model_1 = require("../models/scale.model");
const question_model_1 = require("../models/question.model");
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
/**
 * GET /api/profiles
 * Response - [profile1, profile2]
 */
exports.getProfiles = (req, res) => {
    profile_model_1.Profile.find()
        .populate({
        path: 'scales.scaleId',
        populate: { path: 'categories.categoryId' },
    })
        .then(profiles => {
        res.send(profiles);
    });
};
function getProfilePDF(response, profile) {
    const document = new pdfkit_1.default();
    document.pipe(response);
    document.registerFont('DejaVuSans', path_1.default.join(__dirname, '../public/fonts/DejaVuSans.ttf'));
    profile.scales.forEach((scale) => {
        document.fontSize(18);
        document.font('DejaVuSans').text(scale.scaleId.title, {
            underline: true,
        });
        document.moveDown(0.3);
        document.fontSize(14);
        document.font('DejaVuSans').text(`Ваш результат: ${scale.value}`);
        document.moveDown(0.8);
        document.font('DejaVuSans').text('Категорії:');
        document.moveDown(0.8);
        scale.scaleId.categories.forEach((category) => {
            document.fontSize(12);
            document.font('DejaVuSans').text(category.categoryId.title, {});
            document.moveDown(0.3);
            document.font('DejaVuSans').text(category.description);
            document.moveDown(1);
            document.fontSize(10);
            document
                .font('DejaVuSans')
                .text(`Мінімальне значення категорії: ${category.categoryId.range.low}`);
            document.moveDown(0.2);
            document
                .font('DejaVuSans')
                .text(`Максимальне значення категорії: ${category.categoryId.range.high}`);
            document.moveDown(0.8);
        });
        document.moveDown(3);
    });
    document.end();
}
/**
 * Get /api/profiles/:id
 * Response - [profile]
 */
exports.getProfile = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const format = req.query.format || 'json';
    const profile = yield profile_model_1.Profile.findOne({ _id: id }).populate({
        path: 'scales.scaleId',
        populate: { path: 'categories.categoryId' },
    });
    switch (format) {
        case 'json':
            response.json(profile);
            break;
        case 'document':
            getProfilePDF(response, profile);
            break;
        default:
            response.json(profile);
    }
});
/**
 * Post /api/profiles
 * Request format:
 *  {
        questions: [
            {questionId: "5dc2bd9634fb7ab584b9eb3c", answerId: "5dc2bd9634fb7ab584b9eb38"},
            {questionId: "5dc2bd9634fb7ab584b9eb3d", answerId: "5dc2bd9634fb7ab584b9eb3b"},
            {questionId: "5dc2bdb8962540b597bfa448", answerId: "5dc2bdb8962540b597bfa442"}
        ]
    }
 *
 * Response format:
 * {
     id: "5dc2bd9634fb7ab584b9eb3c",
     scales: [
        {
            scaleTitle: 'Scale1',
            value: 10,
            categories: [
                {
                    title: 'Low values',
                    description: 'You are blablalba',
                    range: { low: 0, high: 10 }
                },
                {
                    title: 'High values',
                    description: 'You are blablalba',
                    range: { low: 10, high: 20 }
                }
            ]
        }
    ]
 }
 */
exports.postProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questions } = req.body;
    const questionValueDictionary = yield createQuestionValueDictionary(questions, answer_model_1.Answer, question_model_1.Question);
    const scaleValueDictionary = yield createScaleValueDictionary(questionValueDictionary, scale_model_1.Scale);
    const scalesData = yield createScalesData(scaleValueDictionary, scale_model_1.Scale);
    saveProfileToDb(questions, scaleValueDictionary, profile_model_1.Profile, scale_model_1.Scale).then(profile => res.json({ id: profile._id, scales: scalesData }));
});
function createQuestionValueDictionary(questions, Answer, Question) {
    return __awaiter(this, void 0, void 0, function* () {
        const questionValueDictionary = {};
        for (let i = 0; i < questions.length; i++) {
            const { questionId, answerId } = questions[i];
            const answers = yield Answer.find({ _id: answerId });
            const questionsData = yield Question.find({ _id: questionId });
            if (answers.length) {
                questionValueDictionary[questionId] = questionsData[0].isReverted
                    ? 7 - answers[0].value
                    : answers[0].value;
            }
        }
        return questionValueDictionary;
    });
}
function createScaleValueDictionary(questionValueDictionary, Scale) {
    return __awaiter(this, void 0, void 0, function* () {
        const scaleValueDictionary = {};
        const scales = yield Scale.find();
        for (let i = 0; i < scales.length; i++) {
            const scale = scales[i];
            for (let j = 0; j < scale.questions.length; j++) {
                const scaleQuestionId = scale.questions[j];
                if (!scaleValueDictionary[scale.id]) {
                    scaleValueDictionary[scale.id] =
                        questionValueDictionary[scaleQuestionId];
                }
                else {
                    scaleValueDictionary[scale.id] +=
                        questionValueDictionary[scaleQuestionId];
                }
            }
        }
        return scaleValueDictionary;
    });
}
function createScalesData(scaleValueDictionary, Scale) {
    return __awaiter(this, void 0, void 0, function* () {
        const scalesData = [];
        const scales = yield Scale.find().populate('categories.categoryId');
        scales.forEach((scale) => {
            const scaleData = {
                id: scale._id,
                scaleTitle: scale.title,
                value: scaleValueDictionary[scale.id] || null,
                categories: [],
            };
            scale.categories.forEach((category) => {
                scaleData.categories.push({
                    title: category.categoryId.title,
                    description: category.description,
                    range: category.categoryId.range,
                });
            });
            scalesData.push(scaleData);
        });
        return scalesData;
    });
}
function saveProfileToDb(questions, scaleValueDictionary, Profile, Scale) {
    return __awaiter(this, void 0, void 0, function* () {
        const scales = yield Scale.find();
        const scalesToSave = [];
        scales.forEach((scale) => {
            scalesToSave.push({
                scaleId: scale.id,
                value: scaleValueDictionary[scale.id] || null,
            });
        });
        const profileData = {
            questions,
            scales: scalesToSave,
        };
        return yield database_1.saveModelWithPromise(Profile, profileData);
    });
}
//# sourceMappingURL=profiles.controller.js.map