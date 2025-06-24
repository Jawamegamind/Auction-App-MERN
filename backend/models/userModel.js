import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // auctionsCreated: {
    //     type: Number,
    //     default: 0,
    //     required: false,
    // },
    auctionsCreated : [{}],
    auctionsWon: {
        type: Number,
        default: 0,
        required: false,
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;