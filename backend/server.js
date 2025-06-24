import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Auction from "./models/auctionModel.js";
import axios from "axios";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

    socket.on("message", (message) => {
      console.log(message);
      io.emit("message", message);
    });

    // Making a case for the login event
    socket.on("login", (user) => {
      console.log(user);
      io.emit("login_response", user);
    });

    // Making a case for a user to join the auction room
    socket.on("join_room", (data) => {
      console.log("Joining room", data.room);
      socket.join(data.room);

      // Once a user joins the auction room, we broadcast to the current users in the room
      // socket.broadcast.to(data.room).emit("new_user", data.user);
    });

    // Making a case for a user to leave the auction room
    socket.on("leave_room", (data) => {
      console.log("Leaving room", data.room);
      socket.leave(data.room);

      // Once a user leaves the auction room, we broadcast to the current users in the room
      socket.broadcast.to(data.room).emit("user_left", data.user);
    });

    // Making a case for a user to bid on an auction
    socket.on("bid", async (data) => {
      console.log("New bid received", data.bid, "from user", data.user, "for auction", data.auction);
      // Sending the socket data to the api endpoint for processing
      try{
        const response = await axios.post("http://localhost:8000/api/auction/set-bid", {
          bidAmount : data.bid,
          user : data.user,
          auction: data.auction
        });

        console.log(response.data);

        // If the bid is successful, we broadcast the new bid to all the users in the room including the user who placed the bid
        if(response.status === 200){
          console.log("The bid was successful")
          io.to(data.auction._id).emit("new_bid", response.data);
        }
        else{
          console.log("Bid failed");
        }
      }
      catch(error){
        console.log(error);
      }
    });

    // Making a case when the client sends an 'auction_ended' event
    socket.on("auction_ended", async(data) => {
    console.log("Auction ended", data);

    if (data.auction.currentWinner === null) {
        console.log("No winner found");
        io.to(data.auction._id).emit("auction_ended_response", data);
    }
    else {
      //Checking if the sendingUser is the same as the currentWinner
      if(data.sendingUser._id === data.auction.currentWinner) {
        console.log("User that sent request is the same as the winning user")

        try {
          const winnerResponse = await axios.post(`http://localhost:8000/api/user/update-user/${data.auction.currentWinner}`, data.auc);
          console.log(winnerResponse.data);
        }
        catch(error){
          console.log(error)
        }
      } 


      // try {
      //   // First, update the auction winner
      //   const winnerResponse = await axios.post(`http://localhost:8000/api/user/update-user/${data.auction.currentWinner}`, data.auc);
      //   console.log(winnerResponse.data);

      //   // Check if the auction still exists before attempting to purge it
      //   // const auctionExists = await axios.get(`http://localhost:8000/api/auction/check-auction/${data.auction._id}`);
      //   // if (auctionExists.data) {
      //   //     // Now, purge the auction
      //   //     const purgeResponse = await axios.delete(`http://localhost:8000/api/auction/purge-auction/${data.auction._id}`);
      //   //     console.log(purgeResponse.data);
      //   // }
      // } catch (error) {
      //     console.log(error);
      // }

      // Broadcast the auction end to all users in the room
      io.to(data.auction._id).emit("auction_ended_response", data);
    }
});
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");

  // Making a connection to MongoDB
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.log(error);
  });
});