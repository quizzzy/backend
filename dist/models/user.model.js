"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const userScheme = new mongoose_1.Schema({
    login: String,
    password: String
});
userScheme.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt_1.default.hash(document.password, saltRounds, function (err, hashedPassword) {
            if (err) {
                next(err);
            }
            else {
                document.password = hashedPassword;
                next();
            }
        });
    }
    else {
        next();
    }
});
userScheme.methods.isCorrectPassword = function (password, callback) {
    bcrypt_1.default.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        }
        else {
            callback(err, same);
        }
    });
};
exports.User = mongoose_1.model("User", userScheme);
//# sourceMappingURL=user.model.js.map