const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register a new user
// @route   POST /api/v1/user/register
// @access  Public
const registerController = async (req, res) => {
    try {
        console.log("--------------- REGISTER ATTEMPT ---------------");
        console.log("Request Body:", req.body);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User already exists:", req.body.email);
            return res
                .status(200)
                .send({ message: "User Already Exist", success: false });
        }

        // Password hashing handled by User model's pre('save') hook
        const newUser = new User(req.body);
        await newUser.save();

        console.log("User created successfully:", newUser);
        res.status(201).send({ message: "Register Successfully", success: true, user: newUser });
    } catch (error) {
        console.log("--------------- REGISTER ERROR ---------------");
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register Controller ${error.message}`,
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
const loginController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "User not found", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Invalid Email or Password", success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).send({ message: "Login Success", success: true, token, user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
};

const authController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({
                message: "user not found",
                success: false,
            });
        } else {
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error,
        });
    }
};

module.exports = { loginController, registerController, authController };
