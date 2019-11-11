import { Response, Request } from 'express';
import { Profile } from '../models/profile.model';
import { saveModelWithPromise } from '../util/database';
import { Answer } from '../models/answer.model';
import { Scale } from '../models/scale.model';
import { Question } from '../models/question.model';
import PDFDocument from 'pdfkit';
import path from 'path';

/**
 * GET /api/profiles
 * Response - [profile1, profile2]
 */
export const getProfiles = (req: Request, res: Response) => {
	Profile.find().then(profiles => {
		res.send(profiles);
	});
};

function getProfilePDF(response: Response, profile: any) {
	const document = new PDFDocument();
	document.pipe(response);

	document.registerFont(
		'DejaVuSans',
		path.join(__dirname, '../public/fonts/DejaVuSans.ttf')
	);

	profile.scales.forEach((scale: any) => {
		document.fontSize(18);
		document.font('DejaVuSans').text(scale.scaleId.title, {
			underline: true,
		});
		document.moveDown(0.3);
		document.fontSize(14);
		document.font('DejaVuSans').text(`Ваш результат: ${scale.value}`);

		document.moveDown(0.8);
		document.font('DejaVuSans').text('Категорії:');
		document.moveDown(0.8);
		scale.scaleId.categories.forEach((category: any) => {
			document.fontSize(12);
			document.font('DejaVuSans').text(category.categoryId.title, {});
			document.moveDown(0.3);
			document.font('DejaVuSans').text(category.description);
			document.moveDown(1);
			document.fontSize(10);
			document
				.font('DejaVuSans')
				.text(
					`Мінімальне значення категорії: ${category.categoryId.range.low}`
				);
			document.moveDown(0.2);
			document
				.font('DejaVuSans')
				.text(
					`Максимальне значення категорії: ${category.categoryId.range.high}`
				);
			document.moveDown(0.8);
		});

		document.moveDown(3);
	});

	document.end();
}

/**
 * Get /api/profiles/:id
 * Response - [profile]
 */
export const getProfile = async (req: Request, response: Response) => {
	const { id } = req.params;
	const format = req.query.format || 'json';

	const profile = await Profile.findOne({ _id: id }).populate({
		path: 'scales.scaleId',
		populate: { path: 'categories.categoryId' },
	});

	switch (format) {
		case 'json':
			response.json(profile);
			break;
		case 'document':
			getProfilePDF(response, profile);
			break;
		default:
			response.json(profile);
	}
};

/**
 * Post /api/profiles
 * Request format:
 *  {
        questions: [
            {questionId: "5dc2bd9634fb7ab584b9eb3c", answerId: "5dc2bd9634fb7ab584b9eb38"},
            {questionId: "5dc2bd9634fb7ab584b9eb3d", answerId: "5dc2bd9634fb7ab584b9eb3b"},
            {questionId: "5dc2bdb8962540b597bfa448", answerId: "5dc2bdb8962540b597bfa442"}
        ]
    }
 * 
 * Response format:
 * {
	 id: "5dc2bd9634fb7ab584b9eb3c",
	 scales: [
        {
            scaleTitle: 'Scale1',
            value: 10,
            categories: [
                {
                    title: 'Low values',
                    description: 'You are blablalba',
                    range: { low: 0, high: 10 }
                },
                {
                    title: 'High values',
                    description: 'You are blablalba',
                    range: { low: 10, high: 20 }
                }
            ]
        }
    ]
 }
 */
export const postProfile = async (req: Request, res: Response) => {
	const { questions } = req.body;

	const questionValueDictionary = await createQuestionValueDictionary(
		questions,
		Answer,
		Question
	);
	const scaleValueDictionary = await createScaleValueDictionary(
		questionValueDictionary,
		Scale
	);

	const scalesData = await createScalesData(scaleValueDictionary, Scale);

	saveProfileToDb(questions, scaleValueDictionary, Profile, Scale).then(
		profile => res.json({ id: profile._id, scales: scalesData })
	);
};

async function createQuestionValueDictionary(
	questions: Array<any>,
	Answer: any,
	Question: any
) {
	const questionValueDictionary: any = {};
	for (let i = 0; i < questions.length; i++) {
		const { questionId, answerId } = questions[i];
		const answers: any = await Answer.find({ _id: answerId });
		const questionsData: any = await Question.find({ _id: questionId });
		if (answers.length) {
			questionValueDictionary[questionId] = questionsData[0].isReverted
				? 7 - answers[0].value
				: answers[0].value;
		}
	}
	return questionValueDictionary;
}

async function createScaleValueDictionary(
	questionValueDictionary: any,
	Scale: any
) {
	const scaleValueDictionary: any = {};
	const scales = await Scale.find();

	for (let i = 0; i < scales.length; i++) {
		const scale: any = scales[i];
		for (let j = 0; j < scale.questions.length; j++) {
			const scaleQuestionId = scale.questions[j];
			if (!scaleValueDictionary[scale.id]) {
				scaleValueDictionary[scale.id] =
					questionValueDictionary[scaleQuestionId];
			} else {
				scaleValueDictionary[scale.id] +=
					questionValueDictionary[scaleQuestionId];
			}
		}
	}
	return scaleValueDictionary;
}

async function createScalesData(scaleValueDictionary: any, Scale: any) {
	const scalesData: any = [];
	const scales = await Scale.find().populate('categories.categoryId');

	scales.forEach((scale: any) => {
		const scaleData: any = {
			id: scale._id,
			scaleTitle: scale.title,
			value: scaleValueDictionary[scale.id] || null,
			categories: [],
		};
		scale.categories.forEach((category: any) => {
			scaleData.categories.push({
				title: category.categoryId.title,
				description: category.description,
				range: category.categoryId.range,
			});
		});
		scalesData.push(scaleData);
	});
	return scalesData;
}

async function saveProfileToDb(
	questions: Array<any>,
	scaleValueDictionary: any,
	Profile: any,
	Scale: any
) {
	const scales = await Scale.find();
	const scalesToSave: any = [];

	scales.forEach((scale: any) => {
		scalesToSave.push({
			scaleId: scale.id,
			value: scaleValueDictionary[scale.id] || null,
		});
	});
	const profileData = {
		questions,
		scales: scalesToSave,
	};
	return await saveModelWithPromise(Profile, profileData);
}
