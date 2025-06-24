import React from "react";
import Navbar from "../components/Navbar";
import { Box, Typography, Button, TextField, Container, CssBaseline } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Alert, AlertTitle} from "@mui/material";

function CreateAuction() {
    const { user, setUser } = useContext(UserContext);
    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
    const [displayFailureAlert, setDisplayFailureAlert] = useState(false);

    const submitHandler = async (e:any) => {
        e.preventDefault();
        // console.log("Submit handler called");

        const formData = Object.fromEntries(new FormData(e.target));
        console.log(formData);

        const {auctionDescription, auctionEndingTime, auctionStartPrice, auctionStartingTime, auctionTitle} = formData;
        console.log(auctionDescription, auctionEndingTime, auctionStartPrice, auctionStartingTime, auctionTitle);

        try{
            const response = await axios.post("http://localhost:8000/api/auction/add-auction", {
                auctionTitle,
                auctionDescription,
                auctionStartPrice,
                auctionStartingTime,
                auctionEndingTime,
                userId: user._id
            });
            console.log(response);

            if(response.status === 200){
                setUser(response.data);
                setDisplaySuccessAlert(true);
            }
        }
        catch(error:any){
            console.log(error);
            setDisplayFailureAlert(true);
        }
    }

    return (
        <div>
            <Navbar />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h3">
                        Create Auction
                    </Typography>
                    <Box sx={{ mb: 3 }} />
                    <Box
                        component="form"
                        onSubmit={submitHandler}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="auctionTitle"
                            label="Auction Title"
                            name="auctionTitle"
                            autoComplete="auctionTitle"
                            autoFocus
                            type = "text"
                            // error = {Boolean(currentPasswordError)}
                            // helperText = {currentPasswordError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="auctionDescription"
                            label="Description"
                            id="auctionDescription"
                            autoComplete="auctionDescription"
                            autoFocus
                            type="text" 
                            // error = {Boolean(newPasswordError)}
                            // helperText = {newPasswordError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="auctionStartPrice"
                            label="Starting Price"
                            id="auctionStartPrice"
                            autoComplete="auctionStartPrice"
                            autoFocus
                            type="number"
                            // error = {Boolean(newPasswordError)}
                            // helperText = {newPasswordError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="auctionStartingTime"
                            label="Starting Time"
                            id="auctionStartingTime"
                            autoComplete="auctionStartingTime"
                            autoFocus
                            type="datetime-local"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            // error = {Boolean(newPasswordError)}
                            // helperText = {newPasswordError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="auctionEndingTime"
                            label="Ending Time"
                            id="auctionEndingTime"
                            autoComplete="auctionEndingTime"
                            autoFocus
                            type="datetime-local"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            // error = {Boolean(newPasswordError)}
                            // helperText = {newPasswordError}
                        />
                        {/* Add some space before the radio button */}
                        <Box sx={{ mb: 1 }} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Auction
                        </Button>
                    </Box>
                    {displaySuccessAlert && (
                    <Alert severity="success" onClose={() => setDisplaySuccessAlert(false)} sx={{ width: "100%", mt: 2 }}>
                        <AlertTitle>Success</AlertTitle>
                        Your auction has been created successfully.
                    </Alert>
                    )}
                    {displayFailureAlert && (
                        <Alert severity="error" onClose={() => setDisplayFailureAlert(false)} sx={{ width: "100%", mt: 2 }}>
                            <AlertTitle>Error</AlertTitle>
                            An error occurred while creating your auction.
                        </Alert>
                    )}
                </Box>
                {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
                {/* <ErrorModal /> */}
            </Container>
        </div>
    );
}

export default CreateAuction;