import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";
import { ScaleCategory } from "../models/scale-category.model";
import { Scale } from "../models/scale.model";
import { User } from "../models/user.model";

const answers = [
    { description: "Повністю не згоден", value: 1 },
    { description: "Здебільшого, не згоден", value: 2 },
    { description: "Де в чому не згоден", value: 3 },
    { description: "Де в чому згоден", value: 4 },
    { description: "Швидше, згоден", value: 5 },
    { description: "Повністю згоден", value: 6 }
];

const questions = [
    { description: "1. Багато людей вважають мене люблячим і дбайливим.", isReverted: false },
    { description: "2. Іноді я змінюю свою поведінку або образ думок, щоб відповідати запитам оточуючих.", isReverted: true },
];

const scaleCategories = [
    { description: "Category 1", range: { low: 0, high: 10 }},
    { description: "Category 1", range: { low: 10, high: 20 }},
    { description: "Category 1", range: { low: 20, high: 30 }},
];

const scales = [
    { questions: [1, 2] },
    { questions: [1] },
    { questions: [2] }
];

const admin = {
    login: "admin",
    password: "nimda",
    isAdmin: true
};

export const setupDatabase = async () => {
    console.log("Setup default database data");

    const savedAnswers = await saveModelsWithPromise(Answer, answers);

    const answerIds = getIdsFromElementsArray(savedAnswers);
    questions.forEach((question: any) => question.answers = answerIds);

    const savedQuestions = await saveModelsWithPromise(Question, questions);

    const questionIds = getIdsFromElementsArray(savedQuestions);

    const savedScaleCategories = await saveModelsWithPromise(ScaleCategory, scaleCategories);

    const scaleCategoriesIds = getIdsFromElementsArray(savedScaleCategories);
    scales.forEach((scale: any) => {
        const questions: Array<string> = [];
        scale.questions.forEach((questionIndex: any) => questions.push(questionIds[questionIndex -1]));
        scale.categories = scaleCategoriesIds;
        scale.questions = questions;
    });

    const savedScales = await saveModelsWithPromise(Scale, scales);
    const savedAdmin = await saveModelWithPromise(User, admin);
};


export function saveModelWithPromise(Model: any, data: any): Promise<any> {
    return new Promise((res, rej) => {
        new Model(data).save((err: any, data: any) => {
            if(err) rej(err);
            res(data);
        });
    });
}

export function saveModelsWithPromise(Model: any, dataArray: Array<any>): Promise<any> {
    const promises: Array<any> = []; 
    dataArray.forEach(data => promises.push(saveModelWithPromise(Model, data)));
    return Promise.all(promises);

}

export function getIdsFromElementsArray(elements: Array<{id: string}>) {
    const ids: Array<string> = [];
    elements.forEach((element: {id: string}) => ids.push(element.id));
    return ids;
}