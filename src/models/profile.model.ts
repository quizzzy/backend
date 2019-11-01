import { model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const profileScheme = new Schema({
    questions: [{
        id: {
            type: ObjectId,
            ref: "Question"
        },
        answer: {
            type: ObjectId,
            ref: "Answer"
        }
    }],
    scales: [{
        id: {
            type: ObjectId,
            ref: "Scale"
        },
        category: {
            type: ObjectId,
            ref: "ScaleCategory"
        },
        value: Number
    }],
});

export const Profile = model("Profile", profileScheme);