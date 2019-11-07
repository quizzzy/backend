import { model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const scaleScheme = new Schema({
    title: String,
    questions: [{
        type: ObjectId,
        ref: "Question"
    }],
    categories: [{
        type: ObjectId,
        ref: "ScaleCategory"
    }],
});

export const Scale = model("Scale", scaleScheme);