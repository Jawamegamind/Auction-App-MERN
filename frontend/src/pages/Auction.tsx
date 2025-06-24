// import React from 'react'
// import { useParams } from 'react-router-dom';
// import { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import Card from '@mui/material/Card';
// import Box from '@mui/material/Box';
// import { Typography } from '@mui/material';
// import io from 'socket.io-client';
// import { UserContext } from '../context/UserContext';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';

// // Define a type for the auction details
// interface AuctionDetails {
//     _id?: string;
//     title?: string;
//     description?: string;
//     startingPrice?: number;
//     currentPrice?: number;
//     startingTime?: string;
//     endingTime?: string;
//     auctionCreator?: string;
// }

// // Create a socket connection
// const socket = io("http://localhost:8000");



// const Auction = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const { user } = useContext(UserContext);
//     const [auctionDetails, setAuctionDetails] = useState<AuctionDetails>({});
//     const { register, handleSubmit, reset } = useForm();
//     console.log("The auction id from use params is: ", id);


//     // Handle form submission
//     const onSubmit = (data: { bid: string }) => {
//         const bid = parseFloat(data.bid);
//         if (isNaN(bid)) {
//             console.error("Invalid bid");
//             return;
//         }

//         // Adding a check that prevents the user from bidding on their own auction
//         if(auctionDetails?.auctionCreator === user._id){
//             console.error("You cannot bid on your own auction");
//             alert("You cannot bid on your own auction");
//             return;
//         }

//         // Emit the 'bid' event to the server
//         socket.emit("bid", { room: id, user: user, bid: bid, auction: auctionDetails});

//         // Reset the form
//         reset();
//     };

//     // Fetching the auction details from the server
//     useEffect (() => {
//         console.log("The auction id is: ", id);

//         // Sending a get request to the server to get the auction details
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/api/auction/get-auction/${id}`);
//                 console.log("The response is: ", response);

//                 console.log("The auction details are: ", auctionDetails);

//                 // //Setting the auction details in the state only if there are any changes to the auction details
//                 // if(response.data.currentPrice !== auctionDetails.currentPrice){
//                 //     console.log("New auction details: ", response.data)
//                 //     setAuctionDetails(response.data);
//                 // }
//                 // else {
//                 //     console.log("No changes to the auction details");
//                 // }
//                 setAuctionDetails(response.data);
//             } catch (error) {
//                 console.error("The error is: ", error);
//             }
//         };

//         fetchData();

//         // Sockets logic
//     // Opening a socket connection to the server for the user to join the auction room
//     socket.emit("join_room", {room: id, user: user});

//     // Checking if the auction has ended
//     if(new Date(auctionDetails?.endingTime || "") < new Date()){
//         console.log("The auction has ended");
//         // Emitting a 'auction_ended' event to the server so that the auction can be removed from the list of active auctions
//         socket.emit("auction_ended", {room: id, auction: auctionDetails});
//     }

//     // Listen for the 'new_bid' event
//     socket.on("new_bid", (data) => {
//         console.log("A new bid has been placed: ", data);
//         // setAuctionDetails(prevDetails => ({ ...prevDetails, ...data.auction }));
//         // Setting the new auction details in the state only if there are any changes to the auction's currentPrice
//         if(data.auction.currentPrice !== auctionDetails.currentPrice){
//             console.log("New auction details: ", data.auction)
//             setAuctionDetails(data.auction);
//         }
//         else {
//             console.log("No changes to the auction details");
//         }
//     });

//     // Listen for the 'auction_ended' event
//     socket.on("auction_ended_response", (data) => {
//         console.log("The auction has ended: ", data);
//         // Simply redirecting the user to the home page for now
//         navigate("/home");
//     });

//     // Clean up the event listeners when the component unmounts
//     return () => {
//         socket.off("new_user");
//         socket.off("new_bid");
//         socket.off("auction_ended");
//     };

//     }, [id, auctionDetails]);

//     return (
//         <div>
//             <Navbar />
//             <Box 
//                 display="flex" 
//                 justifyContent="center" 
//                 alignItems="center" 
//                 minHeight="50vh" // adjust this value as needed
//             >
//                 <Card sx={{ 
//                     width: '50%', 
//                     // bgcolor: 'lightblue', 
//                     padding: { xs: 2, sm: 3 }, 
//                     display: 'flex', // make the Card a flex container
//                     flexDirection: 'column', // stack the children vertically
//                     justifyContent: 'center', // center the content vertically
//                     alignItems: 'center', // center the content horizontally
//                     border: '1px solid black', // add a border around the card
//                 }}>
//                     <Typography variant="h3">Auction</Typography>
//                     {/* Rendering the user's profile here */}
//                     <Typography variant="h6"><b>Auction Id:</b> {auctionDetails?._id}</Typography>
//                     <Typography variant="h6"><b>Title:</b> {auctionDetails?.title}</Typography>
//                     <Typography variant="h6"><b>Description:</b> {auctionDetails?.description}</Typography>
//                     <Typography variant="h6"><b>Starting Price:</b> {auctionDetails?.startingPrice}</Typography>
//                     <Typography variant="h6"><b>Current Price:</b> {auctionDetails?.currentPrice}</Typography>
//                     <Typography variant="h6"><b>Starting Time:</b> {new Date(auctionDetails?.startingTime || "").toLocaleString()}</Typography>
//                     <Typography variant="h6"><b>Ending Time:</b> {new Date(auctionDetails?.endingTime || "").toLocaleString()}</Typography>
//                 </Card>
//             </Box>
//             {/* Adding two buttons here to create a new auction and to change the password */}
//             <Box 
//                 display="flex" 
//                 justifyContent="center" 
//                 alignItems="center" 
//             >
//                 <Box 
//                     padding={3}
//                     display="flex" 
//                     justifyContent="space-between" 
//                     alignItems="center" 
//                     width="50%" 
//                     flexDirection={{ xs: 'column', sm: 'row' }} // stack the children vertically on small screens and horizontally on larger screens
//                 >
//                     {/* Adding a text field to allow the user to bid on the auction */}
//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         <input type="text" placeholder="Enter your bid" {...register("bid")} required />
//                         <button type="submit">Bid</button>
//                     </form>
//                 </Box>
//             </Box>
//         </div>
//     )
// }

// export default Auction;


import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Define a type for the auction details
interface AuctionDetails {
    _id?: string;
    title?: string;
    description?: string;
    startingPrice?: number;
    currentPrice?: number;
    startingTime?: string;
    endingTime?: string;
    auctionCreator?: string;
}

// Create a socket connection
const socket = io("http://localhost:8000");



const Auction = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [auctionDetails, setAuctionDetails] = useState<AuctionDetails>({});
    const { register, handleSubmit, reset } = useForm();
    const [auctionEnded, setAuctionEnded] = useState(false);
    let auctionWon = false;
    console.log("The auction id from use params is: ", id);

    // Sending a get request to the server to get the auction details
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/auction/get-auction/${id}`);
            console.log("The response is: ", response);

            console.log("The auction details are: ", auctionDetails);

            setAuctionDetails(response.data);
        } catch (error) {
            console.error("The error is: ", error);
        }
    }

    // Fetching the auction details from the server
    useEffect (() => {
        console.log("The auction id inside useEffect is: ", id);

        fetchData();

        // Sockets logic
        // Opening a socket connection to the server for the user to join the auction room
        socket.emit("join_room", {room: id, user: user});

        // // Checking if the auction has ended
        // if(new Date(auctionDetails?.endingTime || "") < new Date()){
        //     console.log("The auction has ended");
        //     // Emitting a 'auction_ended' event to the server so that the auction can be removed from the list of active auctions
        //     socket.emit("auction_ended", {room: id, auction: auctionDetails});
        // }

        // Listen for the 'new_bid' event
        socket.on("new_bid", (data) => {
            console.log("A new bid has been placed: ", data);
            console.log("The current price is: ", auctionDetails.currentPrice);
            // setAuctionDetails(prevDetails => ({ ...prevDetails, ...data.auction }));
            // Setting the new auction details in the state only if there are any changes to the auction's currentPrice
            // setAuctionDetails(data);
            if(data.currentPrice > (auctionDetails.currentPrice ?? 0)){
                console.log("New auction details: ", data)
                setAuctionDetails(data);
            }
            else {
                console.log("No changes to the auction details");
            }
        });

        // // Listen for the 'auction_ended' event
        // socket.on("auction_ended_response", (data) => {
        //     console.log("The auction has ended: ", data);
        //     // Simply redirecting the user to the home page for now
        //     navigate("/home");
        // });

        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off("new_user");
            socket.off("new_bid");
            // socket.off("auction_ended");
            socket.off("auction_ended_response");
        };
    }, []);


    // Handle form submission
    const onSubmit = (data: { bid: string }) => {
        const bid = parseFloat(data.bid);
        if (isNaN(bid)) {
            console.error("Invalid bid");
            return;
        }

        // Adding a check that prevents the user from bidding on their own auction
        if(auctionDetails?.auctionCreator === user._id){
            console.error("You cannot bid on your own auction");
            alert("You cannot bid on your own auction");
            return;
        }

        // Emit the 'bid' event to the server
        socket.emit("bid", { room: id, user: user, bid: bid, auction: auctionDetails});

        // Reset the form
        reset();
    };

    // Firing a function every 10 seconds to check if the auction has ended
    // Use a timer to check the auction end time at regular intervals
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Check if the auction has ended
            if (!auctionEnded && new Date(auctionDetails?.endingTime || "") < new Date()) {
                console.log("The auction has ended");
                // Emitting a 'auction_ended' event to the server so that the auction can be removed from the list of active auctions
                socket.emit("auction_ended", {room: id, auction: auctionDetails, sendingUser: user});
                // Update the state to prevent multiple emissions
                setAuctionEnded(true);
            }
            else{
                console.log("Auction has not ended yet")
            }
        }, 2000); // Check every 2 seconds

        // Listen for the 'auction_ended' event
        socket.on("auction_ended_response", async (data) => {
            console.log("The auction has ended: ", data);
            
            //Checking here if the user._id matches the one from the currentWinner in the data received
            //If it does, then the user has won the auction and we ensure that only the won user sends an update message
            // if(data.auction.currentWinner === user._id && !auctionWon){
            //     console.log("You have won the auction");
            //     auctionWon = true;
            //     // Sending a request to update the user's profile
            //     try {
            //         const response = await axios.post(`http://localhost:8000/api/user/update-user/${data.auction.currentWinner}`, data.auc);
            //         console.log("The response is: ", response);

            //         if(response.status === 200){
            //             console.log("User profile updated successfully");
            //             navigate("/home");
            //         }
            //     }
            //     catch (error) {
            //         console.error("The error is: ", error);
            //         navigate("/home");
            //     }
            // }
            // else {
            //     console.log("You have not won the auction");
            //     navigate("/home");
            // }
            // Simply redirecting the user to the home page for now
            navigate("/home");
        });

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId)
            socket.off("auction_ended_response");
        };
    }, [auctionDetails, auctionEnded]);

    return (
        <div>
            <Navbar />
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="50vh" // adjust this value as needed
            >
                <Card sx={{ 
                    width: '50%', 
                    // bgcolor: 'lightblue', 
                    padding: { xs: 2, sm: 3 }, 
                    display: 'flex', // make the Card a flex container
                    flexDirection: 'column', // stack the children vertically
                    justifyContent: 'center', // center the content vertically
                    alignItems: 'center', // center the content horizontally
                    border: '1px solid black', // add a border around the card
                }}>
                    <Typography variant="h3">Auction</Typography>
                    {/* Rendering the user's profile here */}
                    <Typography variant="h6"><b>Auction Id:</b> {auctionDetails?._id}</Typography>
                    <Typography variant="h6"><b>Title:</b> {auctionDetails?.title}</Typography>
                    <Typography variant="h6"><b>Description:</b> {auctionDetails?.description}</Typography>
                    <Typography variant="h6"><b>Starting Price:</b> {auctionDetails?.startingPrice}</Typography>
                    <Typography variant="h6"><b>Current Price:</b> {auctionDetails?.currentPrice}</Typography>
                    <Typography variant="h6"><b>Starting Time:</b> {new Date(auctionDetails?.startingTime || "").toLocaleString()}</Typography>
                    <Typography variant="h6"><b>Ending Time:</b> {new Date(auctionDetails?.endingTime || "").toLocaleString()}</Typography>
                </Card>
            </Box>
            {/* Adding two buttons here to create a new auction and to change the password */}
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
            >
                <Box 
                    padding={3}
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    width="50%" 
                    flexDirection={{ xs: 'column', sm: 'row' }} // stack the children vertically on small screens and horizontally on larger screens
                >
                    {/* Adding a text field to allow the user to bid on the auction */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Enter your bid" {...register("bid")} required />
                        <button type="submit">Bid</button>
                    </form>
                </Box>
            </Box>
        </div>
    )
}

export default Auction;

