import Todo from '../models/todomodel.js';


// create todo
export const createTodo = async (req, res) => {
    try {
        const { content, dueDate } = req.body;
        if (!content) {
            return res.status(200).json({ success: true, message: 'Please provide content' });
        }
        const newTodo = new Todo({
            user: req.user.id,
            content,
            dueDate
        });
        await newTodo.save();
        const todos = await Todo.find({ user: req.user.id });
        return res.status(201).json({ success: true, message: 'Todo created successfully', todos: newTodo });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating todo', error: error.message });
    }
};

// update todo
export const updateTodo = async (req, res) => {
    try {
        const { content, dueDate } = req.body;
        const todo = await Todo.findOne({
            user: req.user.id,
            _id: req.params.id
        });
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        };
        if (content) todo.content = content;
        if (dueDate) todo.dueDate = dueDate;
        await todo.save();
        const todos = await Todo.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Todo updated successfully', todos: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in update todo', error: error.message });
    }
};

// delete todos
export const deleteTodos = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide valid ids' });
        }
        const result = await Todo.deleteMany({
            _id: { $in: ids },
            user: req.user.id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Todos not found' });
        }
        const allTodos = await Todo.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Todos deleted successfully', todos: allTodos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in delete todos', error: error.message });
    }
};

// get all todos
export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id });
        if (todos.length === 0) {
            return res.status(404).json({ success: false, message: "No todos found" });
        }
        return res.status(200).json({ success: true, message: "Todos found successfully", length: todos.length, todos: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get todos", error: error.message });
    }
};

// toggle api
export const toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            user: req.user.id,
            _id: req.params.id
        });
        if (!todo) {
            return res.status(404).json({ success: false, message: 'Todo not found' });
        };
        todo.isCompleted = !todo.isCompleted;
        await todo.save();
        const todos = await Todo.find({ user: req.user.id });
        return res.status(200).json({ success: true, message: 'Todo updated successfully', todo: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in toggle todo', error: error.message });
    }
};

// search api with todo
export const searchTodo = async (req, res) => {
    try {
        const { search } = req.query;
        const todos = await Todo.find({ user: req.user.id, content: { $regex: search, $options: 'i' } });
        if (todos.length === 0) {
            return res.status(404).json({ success: false, message: 'No todos found' });
        }
        return res.status(200).json({ success: true, message: 'Todos found successfully', length: todos.length, todos: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in search todo', error: error.message });
    }
};
