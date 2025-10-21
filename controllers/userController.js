import { hashSync, compareSync } from "bcrypt";

import User from "../models/User.js";
import { createError } from "../errorHandler.js";
import { createAccessToken } from "../auth.js";

export const registerUser = (req, res, next) => {
  if (!req.body.email.includes("@")) {
    return next(createError("Email invalid.", 400));
  }
  if (req.body.password.length < 8) {
    return next(createError("Password must have at least 8 characters.", 400));
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return next(createError("User already registered.", 409));
      }
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashSync(req.body.password, 10)
      });

      return newUser.save()
        .then((user) => res.status(201).json({
          success: true,
          message: "Registered Successfully"
        }))
        .catch(next);

    })
    .catch(next);
}

export const loginUser = (req, res, next) => {
  if (!req.body.email.includes("@")) {
    return next(createError("Email invalid", 400));
  }
  return User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return next(createError("Email not found", 404));
      }
      const isPasswordCorrect = compareSync(req.body.password, user.password);
      if (isPasswordCorrect) {
        return res.status(200).json({
          success: true,
          access: createAccessToken(user)
        });
      } else {
        return next(createError("Email and password do not match", 401));
      }
    })
    .catch(next);
}

export const getUserDetails = (req, res, next) => {
  return User.findById(req.user.id, { password: 0 })
    .then(user => {
      if (!user) {
        return next(createError("Auth failed. Invalid signature.", 403));
      } else {
        return res.status(200).send({ success: true, user: user });
      }
    })
}

