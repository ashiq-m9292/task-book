import express from 'express';
const userRouter = express.Router();
import { isAuth } from '../middleware/authmiddleware.js';
import { uploadFile } from '../middleware/uploads.js';
import { getAllUsers, createUser, loginUser, logoutUser, deleteUser, darkToggle, getProfile, profilePicture, getDarkMode } from '../controller/usercontroller.js';

userRouter.get('/getallusers', isAuth, getAllUsers);
userRouter.post('/createuser', createUser);
userRouter.post('/loginuser', loginUser);
userRouter.post('/logoutuser', isAuth, logoutUser);
userRouter.delete('/deleteuser/:id', isAuth, deleteUser);
userRouter.put('/darkuser', isAuth, darkToggle);
userRouter.get('/getdarkmode', isAuth, getDarkMode);
userRouter.get('/getprofile', isAuth, getProfile);
userRouter.post('/profilepicture', uploadFile.single('image'), isAuth, profilePicture);

export default userRouter;