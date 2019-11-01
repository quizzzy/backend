import { model, Schema } from "mongoose";

const userScheme = new Schema({
    login: String,
    password: String,
    isAdmin: Boolean
})

export const User = model("User", userScheme);