import { model, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const questionScheme = new Schema({
    order: Number,
    description: String,
    isReverted: Boolean,
	answers: [
		{
			type: ObjectId,
			ref: "Answer",
		},
	],
});

export const Question = model("Question", questionScheme);
