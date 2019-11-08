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
            {questionId: "5dc2bdb8962540b597bfa448", answerId: "5dc2bdb8962540b597bfa442"}
        ]
    }]
 * 
 * Response format:
 * [
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
 */
export const postProfile = async (req: Request, res: Response) => {
    const profiles = req.body;

    const { questions } = profiles[0];

    const questionValueDictionary = await createQuestionValueDictionary(questions, Answer, Question);
    const scaleValueDictionary = await createScaleValueDictionary(questionValueDictionary, Scale);
    
    const scalesData = await createScalesData(scaleValueDictionary, Scale);

    res.send(scalesData);

    // const savedProfiles = await saveModelsWithPromise(Profile, profiles);
};


async function createQuestionValueDictionary(questions: Array<any>, Answer: any, Question: any) {
    const questionValueDictionary: any = {};
    for (let i = 0; i < questions.length; i++) {
        const { questionId, answerId } = questions[i];
        const answers: any = await Answer.find({_id: answerId});
        const questionsData: any = await Question.find({_id: questionId});
        if (answers.length) {
            questionValueDictionary[questionId] = questionsData[0].isReverted
                ? 7 - answers[0].value
                : answers[0].value;
        };
    }
    return questionValueDictionary;
}

async function createScaleValueDictionary(questionValueDictionary: any, Scale: any) {
    const scaleValueDictionary: any = {};
    const scales = await Scale.find();

    for (let i = 0; i < scales.length; i++) {
        const scale: any = scales[i];
        for (let j = 0; j < scale.questions.length; j++) {
            const scaleQuestionId = scale.questions[j];
            if(!scaleValueDictionary[scale.id]) {
                scaleValueDictionary[scale.id] = questionValueDictionary[scaleQuestionId];
            } else {
                scaleValueDictionary[scale.id] += questionValueDictionary[scaleQuestionId];
            }
        }
    }
    return scaleValueDictionary;
}

async function createScalesData(scaleValueDictionary: any, Scale: any) {
    const scalesData: any = [];
    const scales = await Scale.find().populate('categories.categoryId');

    scales.forEach((scale: any) => {
        const scaleData: any = {
            scaleTitle: scale.title,
            value: scaleValueDictionary[scale.id] || null,
            categories: []
        };
        scale.categories.forEach((category: any) => {
            scaleData.categories.push({
                title: category.categoryId.title,
                description: category.description,
                range: category.categoryId.range
            });
        });
        scalesData.push(scaleData);
    });
    return scalesData;
}