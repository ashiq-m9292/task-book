import Notes from "../models/notesmodel.js";

// create notes
export const createNotes = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title && !description) {
            return res.status(200).json({ success: true, message: 'Please provide title and description' });
        }
        const newNotes = new Notes({
            user: req.user.id,
            title,
            description
        });
        await newNotes.save();
        const notes = await Notes.find({ user: req.user.id });
        return res.status(201).json({ success: true, message: 'Notes created successfully', notes: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating notes', error: error.message });
    }
};


// get all notes
export const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found" });
        }
        return res.status(200).json({ success: true, message: "Notes found successfully", length: notes.length, notes: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get notes", error: error.message });
    }
};


// delete notes
export const deleteNotes = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide valid ids' });
        }
        const result = await Notes.deleteMany({
            _id: { $in: ids },
            user: req.user.id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Notes not found' });
        }
        const allNotes = await Notes.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Notes deleted successfully', notes: allNotes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in delete notes', error: error.message });
    }
};


// update notes 
export const updateNotes = async (req, res) => {
    try {
        const { title, description } = req.body;
        const note = await Notes.findOne({
            user: req.user.id,
            _id: req.params.id
        });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        };
        if (title) note.title = title;
        if (description) note.description = description;
        await note.save();
        const notes = await Notes.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Notes updated successfully', notes: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in update notes', error: error.message });
    }
};

// pinned api
export const pinnedNotes = async (req, res) => {
    try {
        const note = await Notes.findOne({
            user: req.user.id,
            _id: req.params.id
        });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        };
        note.isPinned = !note.isPinned;
        await note.save();
        const notes = await Notes.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Notes updated successfully', notes: notes });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in pinned notes', error: error.message });
    }
};

// search notes 
export const searchNotes = async (req, res) => {
    try {
        const { search } = req.query;
        const notes = await Notes.find({
            user: req.user.id,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        });
        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: 'No notes found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Notes found successfully',
            length: notes.length,
            notes: notes
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in search notes', error: error.message });
    }
}