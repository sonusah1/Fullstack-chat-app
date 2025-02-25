import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const salt = await bcrypt.genSalt(10);
        const hassedpassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hassedpassword
        });

        if (newUser) {
            //generate jwt token here
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilpic: newUser.profilpic,
            })
        }
        else {
            return res.status(400).json({ message: "Failed to create user" })
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Credential" })
        }

        const ispasswordcorrect = await bcrypt.compare(password, user.password);

        if (!ispasswordcorrect) {
            return res.status(400).json({ message: "Invalid Credential" })
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilpic: user.profilpic,
        })

    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt','',{maxAge:0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilepic } = req.body;
        const userId = req.user._id;

        if (!profilepic) {
            return res.status(400).json({ message: "Please upload a profile picture." });
        }

        // ✅ Upload Image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilepic, {
            folder: "profile-pictures", // Optional: Organize images in a folder
            resource_type: "auto", // Automatically detect image type
        });

        // ✅ Update user in database with Cloudinary image URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepic: uploadResponse.secure_url },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updating profile:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
