import express from 'express';
const noteRouter = express.Router();
import { isAuth } from '../middleware/authmiddleware.js';
import { createNotes, getAllNotes, updateNotes, deleteNotes, pinnedNotes, searchNotes } from '../controller/notescontroller.js';

noteRouter.get('/getallnotes', isAuth, getAllNotes);
noteRouter.post('/createnote', isAuth, createNotes);
noteRouter.put('/updatenote/:id', isAuth, updateNotes);
noteRouter.delete('/deletenotes', isAuth, deleteNotes);
noteRouter.put('/pinnednotes/:id', isAuth, pinnedNotes);
noteRouter.get('/searchnotes', isAuth, searchNotes);


export default noteRouter;