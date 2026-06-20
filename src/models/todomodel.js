import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        default: ""
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;