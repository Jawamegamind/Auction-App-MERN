import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import AuctionCard from "../components/AuctionCard";
// import io from 'socket.io-client';

const Browse = () => {
    // const socket = io.connect("http://localhost:8000");
    // const test_message = () => {
    //     socket.emit("test_message", "Hello from the client side");
    // }

    const [auctions, setAuctions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auction/get-auctions");
                console.log(response);
                setAuctions(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const filteredAuctions = auctions.filter((auction: any) =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const auctionEls = filteredAuctions.map((auction: any, index:any) => {
        return (
            <AuctionCard auction={auction} key={index} />
        )
    });

    return (
        <div>
            <Navbar />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ padding: 5, ml: 5, textAlign: "center" }}>
                    <Typography variant="h3">Auctions</Typography>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>{auctionEls}</Box>
                </Box>
            </Box>
        </div> 
    );
}

export default Browse;