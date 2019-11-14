"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const scale_model_1 = require("../models/scale.model");
/**
 * GET /api/scale
 */
exports.getScales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scales = yield scale_model_1.Scale.find().populate({
        path: 'categories.categoryId',
    });
    res.json(scales);
});
/**
 * Get /api/scale/:id
 */
exports.getScale = (req, res) => {
    res.end('Scale');
};
/**
 * Post /api/scale/:id
 */
exports.postScale = (req, res) => {
    res.end('Scale');
};
//# sourceMappingURL=scales.controller.js.map