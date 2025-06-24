import mongoose from "mongoose";

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startingPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    startingTime : {
        type: Date,
        required: true,
    },
    endingTime: {
        type: Date,
        required: true,
    },
    currentPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    auctionCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    currentWinner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    },
}, {timestamps: true});

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;