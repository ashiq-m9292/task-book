import express from 'express';
const todoRouter = express.Router();
import { isAuth } from '../middleware/authmiddleware.js';
import { createTodo, updateTodo, deleteTodos, getAllTodos, toggleTodo } from '../controller/todocontroller.js';

todoRouter.post('/createtodo', isAuth, createTodo);
todoRouter.put('/updatetodo/:id', isAuth, updateTodo);
todoRouter.delete('/deletetodos', isAuth, deleteTodos);
todoRouter.get('/getalltodos', isAuth, getAllTodos);
todoRouter.put('/toggletodo/:id', isAuth, toggleTodo);


export default todoRouter;