"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const scaleCategoryScheme = new mongoose_1.Schema({
    title: String,
    range: {
        low: Number,
        high: Number // not including
    }
});
exports.ScaleCategory = mongoose_1.model("ScaleCategory", scaleCategoryScheme);
//# sourceMappingURL=scale-category.model.js.map