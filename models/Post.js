import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        _id: {type: String, required: [true, "Author ID is required"]},
        username: {type: String, required: [true, "Username is required"]}
    },
    postId: {
        type: String,
        required: [true, "Post ID is required"]
    },
    comment: {
        type: String,
        required: [true, "Comment is required."]
    },
})

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    content: {
        type: String,
        required: [true, "Post can not be empty."]
    },
    author: {
        _id: {type: String, required: [true, "Author ID is required"]},
        username: {type: String, required: [true, "Username is required"]}
    },
    comments: [commentSchema],
    createdOn: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Post", postSchema);
