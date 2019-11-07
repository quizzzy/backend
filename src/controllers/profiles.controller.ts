import { Response, Request } from "express";
import { Profile } from "../models/profile.model";
import { saveModelsWithPromise } from "../util/database";
import { Answer } from "../models/answer.model";
import { Scale } from "../models/scale.model";
import { Question } from "../models/question.model";

/**
 * GET /api/profiles
 * Response - [profile1, profile2]
 */
export const getProfiles = (req: Request, res: Response) => {
    Profile.find().then(profiles => {
        res.send(profiles);
    });
    
};

/**
 * Get /api/profiles/:id
 * Response - [profile]
 */
export const getProfile = (req: Request, res: Response) => {
    const { id } = req.params;
    Profile.find({_id: id}).then(profile => {
        res.send(profile);
    });
};
 
/**
 * Post /api/profiles
 * Request format:
 *  [{
        questions: [
            {questionId: "5dc2bd9634fb7ab584b9eb3c", answerId: "5dc2bd9634fb7ab584b9eb38"},
            {questionId: "5dc2bd9634fb7ab584b9eb3d", answerId: "5dc2bd9634fb7ab584b9eb3b"},
            {questionId: "5dc2bdb8962540b597bfa448", answerId: "5dc2bdb8962540b597bfa442"},
        ],
        scales: [
            {scaleId: "5dc2cfd9fbec1ab968687b63", categoryId: "5dc2cfd9fbec1ab968687b60", value: 10},
            {scaleId: "5dc2cfd9fbec1ab968687b62", categoryId: "5dc2cfd9fbec1ab968687b5f", value: 20},
            {scaleId: "5dc2cfd9fbec1ab968687b61", categoryId: "5dc2cfd9fbec1ab968687b60", value: 30},
        ]
    }]
 * 
 */
export const postProfile = async (req: Request, res: Response) => {
    const profiles = req.body;
    // const savedProfiles = await saveModelsWithPromise(Profile, profiles);
    handleProfileSave(profiles[0]);
    // res.send(savedProfiles);
};

async function handleProfileSave(profile: any) {
    const { questions } = profile;
    const scales = await Scale.find();

    const questionIdValueDictionary: any = {};
    const scaleIdValueDictionary: any = {};

    for (let i = 0; i < questions.length; i++) {
        const { questionId, answerId } = questions[i];
        const answers: any = await Answer.find({_id: answerId});
        const questionsData: any = await Question.find({_id: questionId});
        if (answers.length) {
            questionIdValueDictionary[questionId] = questionsData.isReverted
                ? 7 - answers[0].value
                : answers[0].value;
        };
    }

    for (let i = 0; i < scales.length; i++) {
        const scale: any = scales[i];
        for (let j = 0; j < scale.questions.length; j++) {
            const scaleQuestionId = scale.questions[j];
            if(!scaleIdValueDictionary[scale.id]) {
                scaleIdValueDictionary[scale.id] = questionIdValueDictionary[scaleQuestionId];
            } else {
                scaleIdValueDictionary[scale.id] += questionIdValueDictionary[scaleQuestionId];
            }
        } 
    }
    console.log('questionIdValueDictionary', questionIdValueDictionary);
    console.log('scaleIdValueDictionary', scaleIdValueDictionary);
}