"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.Types.ObjectId;
const scaleScheme = new mongoose_1.Schema({
    title: String,
    questions: [{
            type: ObjectId,
            ref: "Question"
        }],
    categories: [{
            categoryId: { type: ObjectId, ref: "ScaleCategory" },
            description: String
        }],
});
exports.Scale = mongoose_1.model("Scale", scaleScheme);
//# sourceMappingURL=scale.model.js.map