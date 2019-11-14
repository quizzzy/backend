import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";
import { ScaleCategory } from "../models/scale-category.model";
import { Scale } from "../models/scale.model";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { Model } from "mongoose";

import { answers } from "../data/answers";
import { questions } from "../data/questions";
import { scaleCategories } from "../data/scale-categories";
import { scales } from "../data/scales";

const admin = {
    login: "admin",
    password: "nimda"
};

export const setupDatabase = async () => {
    console.log("Drop existing collections");

    await dropCollectionsIfExists(Answer, Question, Scale, ScaleCategory, User);

    console.log("Setup default database data");

    const savedAnswers = await saveModelsWithPromise(Answer, answers);

    const answerIds = getIdsFromElementsArray(savedAnswers);
    questions.forEach((question: any) => (question.answers = answerIds));

    const savedQuestions = await saveModelsWithPromise(Question, questions);

    const questionIds = getIdsFromElementsArray(savedQuestions);

    const savedScaleCategories = await saveModelsWithPromise(
        ScaleCategory,
        scaleCategories
    );

    const scaleCategoriesIds = getIdsFromElementsArray(savedScaleCategories);
    scales.forEach((scale: any) => {
        const questions: Array<string> = [];
        scale.questions.forEach((questionIndex: any) =>
            questions.push(questionIds[questionIndex - 1])
        );
        scale.categories.forEach(
            (category: any, index: number) =>
                (category.categoryId = scaleCategoriesIds[index])
        );
        scale.questions = questions;
    });

    const savedScales = await saveModelsWithPromise(Scale, scales);
    const savedUser = await saveModelWithPromise(User, admin);
    console.log("savedUser", savedUser);
};

export const dropCollectionsIfExists = async (...models: Array<Model<any>>) => {
    for (let i = 0; i < models.length; i++) {
        const list = await models[i].db.db
            .listCollections({
                name: models[i].collection.name
            })
            .toArray();
        if (list.length > 0) {
            await models[i].collection.drop();
            console.log("drop", list[0].name);
        }
    }
};

export function saveModelWithPromise(Model: any, data: any): Promise<any> {
    return new Promise((res, rej) => {
        new Model(data).save((err: any, data: any) => {
            if (err) rej(err);
            res(data);
        });
    });
}

export function saveModelsWithPromise(
    Model: any,
    dataArray: Array<any>
): Promise<any> {
    const promises: Array<any> = [];
    dataArray.forEach(data => promises.push(saveModelWithPromise(Model, data)));
    return Promise.all(promises);
}

export function getIdsFromElementsArray(elements: Array<{ id: string }>) {
    const ids: Array<string> = [];
    elements.forEach((element: { id: string }) => ids.push(element.id));
    return ids;
}
