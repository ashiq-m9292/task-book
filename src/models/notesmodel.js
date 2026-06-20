import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notes = mongoose.model("Note", notesSchema);
export default Notes;