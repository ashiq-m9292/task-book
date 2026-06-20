// dotenv 
import dotenv from "dotenv";
dotenv.config();

// express
import express from "express";
const app = express();

// cors
import cors from 'cors';
app.use(cors());

// express json configuration 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// port
const PORT = process.env.PORT || 5000;

// helmet
import helmet from 'helmet';
app.use(helmet());

// cookie parser
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// connect to database
import connectDB from "./src/database/database.js";
connectDB(process.env.DB_URL);

// routes
import userRouter from "./src/routes/userroutes.js";
import noteRouter from "./src/routes/notesroutes.js";
import todoRouter from "./src/routes/todoroutes.js";
app.use('/api/v2/user', userRouter);
app.use('/api/v2/notes', noteRouter);
app.use('/api/v2/todos', todoRouter);

// cloudinary config 
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});