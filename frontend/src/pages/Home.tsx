import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Typography, Box, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    console.log("The user in home is: ", user);

    const redirectToCreateAuction = () => {
        console.log("Redirecting to create auction");
        navigate("/create-auction");
    }

    // Creating a function that call the route to remove all expired auctions
    const removeExpiredAuctions = async () => {
        try {
            const response = await axios.delete("http://localhost:8000/api/auction/purge-ended-auctions");
            console.log("The response is: ", response);
        }
        catch (error) {
            console.error("An error occurred: ", error);
        }
    }


    removeExpiredAuctions();

    return (
        <div>
            <Navbar />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="30vh"
            >
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to BidMe
                </Typography>
                <Typography variant="h6" component="p" gutterBottom>
                    Discover unique items and bid to win!
                </Typography>
                <Button variant="contained" color="primary" onClick={redirectToCreateAuction}>
                    Join Now!
                </Button>
            </Box>
        </div>
    );
}

export default Home;