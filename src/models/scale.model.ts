import { model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const scaleScheme = new Schema({
    title: String,
    questions: [{
        type: ObjectId,
        ref: "Question"
    }],
    categories: [{
        categoryId: {type: ObjectId, ref: "ScaleCategory"},
        description: String
    }],
});

export const Scale = model("Scale", scaleScheme);