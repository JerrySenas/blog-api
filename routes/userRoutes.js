import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserDetails
} from "../controllers/userController.js";
import { verify } from "../auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/details", verify, getUserDetails);

export default router;
