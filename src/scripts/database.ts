import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";


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

export const setupDatabase = async () => {
    console.log("Setup default database data");

    const savedAnswers = await saveModelsWithPromise(Answer, answers);
    console.log('savedAnswers', savedAnswers);

    const answerIds: Array<string> = [];
    savedAnswers.forEach((answer: any) => answerIds.push(answer.id));
    questions.forEach((question: any) => question.answers = answerIds);

    const savedQuestions = await saveModelsWithPromise(Question, questions);
    console.log('savedQuestions', savedQuestions);

};


function saveModelWithPromise(Model: any, data: any): Promise<any> {
    return new Promise((res, rej) => {
        new Model(data).save((err: any, data: any) => {
            if(err) rej(err);
            res(data);
        })
    })
}

function saveModelsWithPromise(Model: any, dataArray: Array<any>): Promise<any> {
    const promises: Array<any> = []; 
    dataArray.forEach(data => promises.push(saveModelWithPromise(Model, data)));
    return Promise.all(promises);

}