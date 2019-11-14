import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const userScheme = new Schema({
    login: String,
    password: String
});

userScheme.pre('save', function(next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
      // Saving reference to this because of changing scopes
      const document: any = this;
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
          next(err);
        }
        else {
          document.password = hashedPassword;
          next();
        }
      });
    } else {
      next();
    }
  });

userScheme.methods.isCorrectPassword = function(password: String, callback: Function) {
    bcrypt.compare(password, this.password, function(err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
  }

export const User = model("User", userScheme);