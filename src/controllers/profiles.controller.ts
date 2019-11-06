import { Response, Request } from "express";
import { Profile } from "../models/profile.model";
import { saveModelWithPromise } from "../util/database";

/**
 * GET /api/profile
 * Response - [profile1, profile2]
 */
export const getProfiles = (req: Request, res: Response) => {
    Profile.find().then(profiles => {
        console.log("profiles", profiles);
        res.send(profiles);
    });
    
};

/**
 * Get /api/profile/:id
 * Response - [profile]
 */
export const getProfile = (req: Request, res: Response) => {
    console.log("params", req.params);
    const { id } = req.params;
    Profile.find({_id: id}).then(profile => {
        console.log("profile", profile);
        res.send(profile);
    });
};
 
/**
 * Post /api/profile
 * Request format:
 *  {
        questions: [
            {questionId: "5dc2bd9634fb7ab584b9eb3c", answerId: "5dc2bd9634fb7ab584b9eb38"},
            {questionId: "5dc2bd9634fb7ab584b9eb3d", answerId: "5dc2bd9634fb7ab584b9eb3b"},
            {questionId: "5dc2bdb8962540b597bfa448", answerId: "5dc2bdb8962540b597bfa442"},
        ],
        scales: [
            {scaleId: "5dc2cfd9fbec1ab968687b63", categoryId: "5dc2cfd9fbec1ab968687b60", value: 10},
            {scaleId: "5dc2cfd9fbec1ab968687b62", categoryId: "5dc2cfd9fbec1ab968687b5f", value: 20},
            {scaleId: "5dc2cfd9fbec1ab968687b61", categoryId: "5dc2cfd9fbec1ab968687b60", value: 30},
        ]
    };
 * 
 */
export const postProfile = async (req: Request, res: Response) => {
    const profile = req.body;
    const savedProfile = await saveModelWithPromise(Profile, profile);
    res.send(savedProfile);
};