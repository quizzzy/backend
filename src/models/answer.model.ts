import { model, Schema } from "mongoose";

const answerScheme = new Schema({
    description: String,
    value: Number,
})

export const Answer = model("Answer", answerScheme);