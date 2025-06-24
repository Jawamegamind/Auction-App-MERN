import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Function to hash the password
const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};

// Function to compare the hashed password with the plain password
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

// Creating a route for a user to login to the auction app
router.post("/login", async (req, res) => {
    console.log("Entering the login route");
    console.log(req.body);
    const { userName, password } = req.body;

    console.log(userName, password);

    // Checking if the user exists
    const user = await User.findOne({ userName: userName });

    // If the user does not exist, return an error message
    if (user === null) {
        console.log("User does not exist");
        return res.status(400).json({ message: "User does not exist" });
    }
    else {
        // If the user exists, compare the entered password with the stored password
        const isPasswordCorrect = await comparePasswords(password, user.password);

        // If the password is incorrect, return an error message
        if (!isPasswordCorrect) {
            console.log("Invalid password");
            return res.status(400).json({ message: "Invalid password" });
        }
        else {
            console.log("User logged in successfully");
            return res.status(200).json(user);
        }
    }
});

// Creating a route to help a user change his/her password
router.post("/change-password", async (req, res) => {
    console.log("Entering the change password route");
    console.log(req.body);
    const { userName, currentPassword, newPassword } = req.body;

    // Checking if the user exists
    const user = await User.findOne({ userName: userName });

    // If the user does not exist, return an error message
    if (user === null) {
        console.log("User does not exist");
        return res.status(400).json({ message: "User does not exist" });
    }
    else {
        // If the user exists, compare the entered password with the stored password
        const isPasswordCorrect = await comparePasswords(currentPassword, user.password);

        // If the password is incorrect, return an error message
        if (!isPasswordCorrect) {
            console.log("Invalid password");
            return res.status(400).json({ message: "Invalid password" });
        }
        else {
            // If the password is correct, hash the new password and update the user's password
            user.password = await hashPassword(newPassword);
            try {
                await user.save();
                console.log("Password updated successfully");
                return res.status(200).json({ message: "Password updated successfully" });
            }
            catch (error) {
                console.log("Password update failed with error: ", error);
                return res.status(500).json({ message: "Password update failed with error: " + error });
            }
        }
    }
});


export {router};