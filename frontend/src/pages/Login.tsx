import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import {Link} from '@mui/material';
import {Grid} from '@mui/material';
import {Box} from '@mui/material';
import {Typography} from '@mui/material';
import {Container} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button} from '@mui/material';
import {Avatar} from '@mui/material';
import {CssBaseline} from '@mui/material';
import {LockOutlined} from '@mui/icons-material';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import io from 'socket.io-client';

const socket = io("http://localhost:8000");

function Login () {
    const sendLoginMessage = () => {
        socket.emit("login", "Hello from the client side");
    }

    const {user, setUser} = useContext(UserContext);

    const navigate = useNavigate();

    // Using a useEffect hook to see if the socket receives a response from the server
    useEffect(() => {
        socket.on("login_response", (data) => {
            console.log("The server sent a response: ", data);
        });
    }, [socket]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            console.log("Setting user from local storage: ", storedUser);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        console.log("The user in useEffect is: ", user);

        if(user){
            navigate("/home");
        }
        console.log("Storing the user in local storage: ", user);
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const redirectToSignUp = () => {
        navigate("/");
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let formData = Object.fromEntries(new FormData(e.target));
        const { userName, password } = formData;

        console.log("The form data is: ", formData);

        //Sending the login message through the socket
        sendLoginMessage();

        try{
            const response = await axios.post("http://localhost:8000/api/user-login/login", {
                userName,
                password,
            });

            console.log("The response is: ", response);

            if(response.status === 200){
                console.log("Setting user: ", response.data);
                setUser(response.data);
                navigate("/home");
            }
        }
        catch(error){
            console.error("An error occurred: ", error);
        }
    }

    return (
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
                    BidMe
                </Typography>
                <Box sx={{ mb: 3 }} />

                <Avatar
                    sx={{
                        m: 1,
                        bgcolor: "secondary.main",
                        // width: 56,
                        // height: 56,
                    }}
                >
                    <LockOutlined />
                    {/* <img src="devsinc_logo.jpeg" alt="Custom" /> */}
                </Avatar>

                <Typography component="h1" variant="h5">
                    Log In
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="Username"
                        name="userName"
                        autoComplete="userName"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {/* Add some space before the radio button */}
                    <Box sx={{ mb: 1 }} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    redirectToSignUp();
                                }}
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
            {/* <ErrorModal /> */}
        </Container>
    );
}

export default Login;