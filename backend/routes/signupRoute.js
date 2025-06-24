import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Function to hash the password
const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};

//Defining a function to check if a user with the entered username already exists in the database
const checkUserExists = async (UserName) => {
    const user = await User.findOne({ userName: UserName});
    // console.log("A user with the entered username already exists", user);
    if (user === null) {
        return null;
    }
    else{
        console.log("A user with the entered username already exists");
        return user;
    }
}

// Creating a route for a user to sign up for the auction app
router.post("/signup", async (req, res) => {
    console.log("Entering the signup route");
    const { firstName, lastName, userName, password } = req.body;

    // Checking if the user already exists
    const userExists = await checkUserExists(userName);

    // If the user already exists, return an error message
    if (userExists) {
        return res.status(400).json({message: "User already exists"});
    }
    else {
        console.log("Creating a new user");
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: await hashPassword(password),
        });

        try{
            await newUser.save();
            res.status(201).json({message: "User created successfully"});
        }
        catch(error){
            res.status(500).json({message: "User creation failed with error: " + error});
        }
    }
});

export {router};