import jwt from "jsonwebtoken";
import { createError } from "./errorHandler.js";
const JWT_SECRET_KEY = "BlogAPI";

export const createAccessToken = (user) => {
    const data = {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, JWT_SECRET_KEY, {});
}

export const verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return next(createError("Auth failed. No token.", 400));
    }
    token = token.slice(7, token.length);

    jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return next(createError(err.message, 403));
        } else {
            req.user = decodedToken;
            next();
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return next(createError("Auth failed. Action forbidden.", 403));
    }
}
