import { model, Schema } from "mongoose";

const scaleCategoryScheme = new Schema({
    title: String,
    range: {
        low: Number, // including
        high: Number // not including
    }
});

export const ScaleCategory = model("ScaleCategory", scaleCategoryScheme);