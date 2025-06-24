import express from "express";
import User from "../models/userModel.js";
import Auction from "../models/auctionModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Creating a route to add a new auction into the database
router.post("/add-auction", async (req, res) => {
    console.log("Entering the add auction route");
    console.log(req.body);
    const {auctionDescription, auctionEndingTime, auctionStartPrice, auctionStartingTime, auctionTitle, userId} = req.body;

    // Creating a new auction object
    const newAuction = new Auction({
        title: auctionTitle,
        description: auctionDescription,
        startingPrice: auctionStartPrice,
        startingTime: auctionStartingTime,
        endingTime: auctionEndingTime,
        currentPrice: auctionStartPrice,
        auctionCreator: userId,
    });

    // Saving the new auction object into the database
    const savedAuction = await newAuction.save();
    console.log("Auction added successfully");
    // return res.status(200).json(savedAuction);

    //Before returning we need to update the user's auctions created array
    const userUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { auctionsCreated: savedAuction } },
        { new: true }
    );
    console.log("User updated successfully", userUpdate);
    // const userUpdate = await User.findOneAndUpdate( {_id: userId}, { $inc: {auctionsCreated: 1} }, {new: true});
    // console.log("User updated successfully", userUpdate);

    return res.status(200).json(userUpdate);
});

//Creating a route to get all the auctions from the database
// router.get("/get-auctions", async (req, res) => {
//     console.log("Entering the get auctions route");
//     const auctions = await Auction.find({})
//     console.log("Auctions retrieved successfully");
//     return res.status(200).json(auctions);
// });

router.get("/get-auctions", async (req, res) => {
    console.log("Entering the get auctions route");
    const currentTime = new Date();
    const auctions = await Auction.find({
        startingTime: { $lt: currentTime },  // Auction has started
        endingTime: { $gt: currentTime }     // Auction has not ended
    });
    console.log("Auctions retrieved successfully");
    return res.status(200).json(auctions);
});

// Creating a route to get a specific auction's details based on the auction ID
router.get("/get-auction/:id", async (req, res) => {
    console.log("Entering the get auction route");
    const auction = await Auction.findOne({_id: req.params.id});
    console.log("Auction retrieved successfully");
    return res.status(200).json(auction);
});

// Creating a route to purge ended auctions from the database
router.delete("/purge-ended-auctions", async (req, res) => {
    console.log("Entering the purge ended auctions route");
    const currentTime = new Date();
    // Find auctions where the endingTime is less than or equal to the current time and where the starting price is still 0 (i.e. no bids have been placed)
    const endedAuctions = await Auction.find({ endingTime: { $lte: currentTime }, startingPrice: 0 });
    // Delete the ended auctions
    await Auction.deleteMany({ endingTime: { $lte: currentTime }});
    console.log("Ended auctions purged successfully");
    return res.status(200).json(endedAuctions);
    // const endedAuctions = await Auction.find({ endingTime: { $lte: currentTime } });
    // // Delete the ended auctions
    // await Auction.deleteMany({ endingTime: { $lte: currentTime } });
    // console.log("Ended auctions purged successfully");
    // return res.status(200).json(endedAuctions);
});

// Creating a route to set a new bid on an auction received from the user
router.post("/set-bid", async (req, res) => {
    console.log("Entering the set bid route");
    console.log(req.body);
    const {bidAmount, user, auction} = req.body;

    let auctionId = auction._id;
    let userId = user;
    let userBid = bidAmount;

    // First we find the corresponding auction in the database
    const auctionToBid = await Auction.findOne({_id: auctionId});
    console.log("Auction found", auctionToBid);

    // Once the auction is found we check if the bid is higher than the current price
    if(userBid > auctionToBid.currentPrice) {
        // If the bid is higher we update the current price and the user who placed the bid
        const updatedAuction = await Auction.findOneAndUpdate({_id: auctionId}, {currentPrice: userBid, currentWinner: userId}, {new: true});
        console.log("Auction updated successfully", updatedAuction);
        return res.status(200).json(updatedAuction);
    } else {
        console.log("Bid is not higher than the current price");
        return res.status(400).json({message: "Bid is not higher than the current price"});
    }
});

// Creating a route to purge a specific auction from the database
router.delete("/purge-auction/:id", async (req, res) => {
    console.log("Entering the purge auction route", req.params.id);

    try {
         // Deleting the auction
        const auctionDeleted = await Auction.findOneAndDelete({_id: req.params.id});
        console.log("Auction purged successfully");
        return res.status(200).json(auctionDeleted);
    } catch (error) {
        console.log("An error occurred while updating the user or deleting the auction", error);
        return res.status(500).json({ message: "An error occurred while updating the user or deleting the auction" });
    }
});

// Creating a route to check if a specific auction exists in the database and return a boolean value
router.get("/check-auction/:id", async (req, res) => {
    console.log("Entering the check auction route", req.params.id);

    try {
        // Checking if the auction exists
        const auction = await Auction.findOne({_id: req.params.id});
        console.log("Auction found", auction);
        return res.status(200).json(true);
    } catch (error) {
        console.log("Auction not found", error);
        return res.status(404).json(false);
    }
});



export {router};