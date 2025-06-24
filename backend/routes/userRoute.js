import express from "express";
import User from "../models/userModel.js";
import Auction from "../models/auctionModel.js";

const router = express.Router();

// Creating a route to fetch the user details based on the user ID
router.get("/get-user/:id", async (req, res) => {
    console.log("Entering the get user route");
    const user = await User.findById(req.params.id);
    console.log("User retrieved successfully");
    return res.status(200).json(user);
});

// Creating a route that allows for the updating of the user details
router.post("/update-user/:id", async (req, res) => {
    console.log("Entering the update user route", req.body);

    try {

        // Need to just update the auctionsWon field and increment it by 1
        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, { $inc: {auctionsWon: 1} }, {new: true});
        console.log("User updated successfully", updatedUser);
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error updating user", error);
        return res.status(400).json(error);
    }
});

export { router };