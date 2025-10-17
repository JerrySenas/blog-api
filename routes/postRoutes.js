import { Router } from "express";
import {
    addPost,
    addComment,
    getAllPosts,
    getPostById,
    getComments,
    updatePost,
    deletePost,
    deleteComment,
} from "../controllers/postController.js";
import { verify, verifyAdmin } from "../auth.js";

const router = Router();

router.get("/getPosts", getAllPosts);
router.get("/getPost/:id", getPostById);
router.get("/getComments/:id", getComments);
router.patch("/addComment/:id", verify, addComment);
router.post("/addPost", verify, addPost);
// Has Admin Check inside
router.patch("/updatePost/:id", verify, updatePost);
router.delete("/deletePost/:id", verify, deletePost);
router.delete("/deleteComment/:id", verify, deleteComment);

export default router;
