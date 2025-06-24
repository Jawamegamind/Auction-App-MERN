import * as React from 'react';
import Navbar from '../components/Navbar';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useContext, useState, useEffect } from 'react';
import {Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuctionCard from '../components/AuctionCard';



function UserProfile() {
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState({});
    const [auctions, setAuctions] = useState([]);

    const userId = user?._id;

    const navigate = useNavigate();

    const redirectToPasswordChange = () => {
        navigate("/change-password");
    }

    const redirectToCreateAuction = () => {
        navigate("/create-auction");
    }

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/get-user/${userId}`);
            console.log("The response is: ", response);
            if (response.status === 200) {
                setUserProfile(response.data);
                setAuctions(response.data.auctionsCreated);
            }
        }
        catch (error) {
            console.error("An error occurred: ", error);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Mapping the auctionsCreated objects from the user's profile received to the AuctionCard component
    const auctionEls = auctions.map((auction: any, index:any) => {
        return (
            <AuctionCard auction={auction} key={index} />
        )
    });

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
                    <Typography variant="h3">User Profile</Typography>
                    {/* Rendering the user's profile here */}
                    <Typography variant="h6">Username: {userProfile?.userName}</Typography>
                    <Typography variant="h6">First Name: {userProfile?.firstName}</Typography>
                    <Typography variant="h6">Last Name: {userProfile?.lastName}</Typography>
                    {/* <Typography variant="h6">Auctions Created: {userProfile?.auctionsCreated}</Typography> */}
                    <Typography variant="h6">Auctions Won: {userProfile?.auctionsWon}</Typography>
                    {/* Rendering the auctions created by the user */}
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>{auctionEls}</Box>
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
                    <Button variant='contained' className="create-auction" onClick={redirectToCreateAuction}>Create a New Auction</Button>
                    <Button variant='contained' className="change-password" onClick={redirectToPasswordChange}>Change Password</Button>
                </Box>
            </Box>
        </div>
    );
}

export default UserProfile;