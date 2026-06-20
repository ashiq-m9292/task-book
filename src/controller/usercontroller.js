import User from "../models/usermodel.js";
import { uploadToCloudinary } from "../utility/uploadcloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        return res.status(200).json({ success: true, user: users });
    } catch (error) {
        returnres.status(500).json({ success: false, message: "Failed to get users", error: error.message });
    }
};

// create user
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(200).json({ success: true, message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ success: true, message: 'User already exists' });
        }

        // create new user
        const newUser = new User({
            name,
            email,
            password
        });
        await newUser.save();
        return res.status(201).json({ success: true, message: 'User created successfully', user: newUser });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in creating user', error: error.message });
    }
};

// login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ success: true, message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: true, message: 'Invalid email or password' });
        }

        //    password compare function
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // ṭoken generation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // send response save cookie
        return res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
        }).json({ success: true, message: 'User login in successfully', name: user.name, email: user.email, token: token });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in login user', error: error.message });
    }
};

// logout user
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: 'User logout successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in logout user', error: error.message });
    }
};

// delete user 
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully', user: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in delete user', error: error.message });
    }
};

// dark mode toggle api
export const darkToggle = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' });
        }
        user.isDark = !user.isDark;
        await user?.save();
        return res.status(200).json({ success: true, message: 'dark mode updated successfully', darkmode: user.isDark });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in dark mode toggle',
            error: error.message
        });
    }
};

// get dark mode api
export const getDarkMode = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        return res.status(200).json({ success: true, message: 'dark mode found successfully', darkmode: user.isDark })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in getting dark mode',
            error: error.message
        });
    }
}

// get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' });
        }
        return res.status(200).json({ success: true, user: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'error in get profile', error: error.message });
    }
};

//creating profile picture 
export const profilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        };
        const image = req.file;
        if (!image) {
            return res.status(404).json({ success: false, message: 'please provide image' })
        };
        if (user.picture.public_id) {
            await cloudinary.uploader.destroy(user.picture.public_id)
        }
        const result = await uploadToCloudinary(image.buffer, 'profile-picture');
        user.picture = {
            public_id: result.public_id,
            url: result.secure_url
        };
        await user?.save();
        return res.status(200).json({ success: true, message: 'profile updated successfully', user: user })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'error in creating image',
            error: error.message
        });
    }
};