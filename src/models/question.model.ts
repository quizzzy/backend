import { model, Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

const questionScheme = new Schema({
	description: String,
	answers: [
		{
			type: ObjectId,
			ref: 'Answer',
		},
	],
	isReverted: Boolean,
});

export const Question = model('Question', questionScheme);
