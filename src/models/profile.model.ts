import { model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const profileScheme = new Schema({
    questions: [{
        questionId: {
            type: ObjectId,
            ref: "Question"
        },
        answerId: {
            type: ObjectId,
            ref: "Answer"
        }
    }],
    scales: [{
        scaleId: {
            type: ObjectId,
            ref: "Scale"
        },
        categoryId: {
            type: ObjectId,
            ref: "ScaleCategory"
        },
        value: Number
    }],
});

export const Profile = model("Profile", profileScheme);