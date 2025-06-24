import React from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

function UserSignUp () {
    const navigate = useNavigate();

    const [displayCircularProcessing, setDisplayCircularProcessing] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [redirected, setRedirected] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log("Stored user:", storedUser)
        if (storedUser) {
            console.log("Set user from localstorage")
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        console.log("User:", user);

        if (user) {
            console.log("Redirecting to homepage");
    
            navigate("/home");

            console.log("Storing user in local storage")
            localStorage.setItem("user", JSON.stringify(user));

            setRedirected(true);
        }
    }, [user, navigate, redirected]);


    const isNameValid = (name:string) => {
        return /^[a-zA-Z]+$/.test(name.trim());
    };

    const isPasswordStrong = (password:string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
        const hasMinLength = password.length >= 8;
        return hasUpperCase && hasSpecialChar && hasMinLength;
    };


    const submitHandler = async (e: any) => {
        setDisplayCircularProcessing(true);
        e.preventDefault();

        let formData = Object.fromEntries(new FormData(e.target));
        const { firstName, lastName, userName, password } = formData;

        console.log("The form data is: ", formData);

        let hasError = false;

        if (!String(firstName).trim()) {
            setFirstNameError("First name cannot be empty.");
            hasError = true;
        } else if (!isNameValid(String(firstName))) {
            setFirstNameError("First name can only contain letters.");
            hasError = true;
        } else {
            setFirstNameError("");
        }

        if (!String(lastName).trim()) {
            setLastNameError("Last name cannot be empty.");
            hasError = true;
        } else if (!isNameValid(String(lastName))) {
            setLastNameError("Last name can only contain letters.");
            hasError = true;
        } else {
            setLastNameError("");
        }

        if (!String(userName).trim()) {
            setUserNameError("Username cannot be empty.");
            hasError = true;
        } else {
            setUserNameError("");
        }

        if (!String(password).trim()) {
            setPasswordError("Password cannot be empty.");
            hasError = true;
        } else if (!isPasswordStrong(String(password))) {
            setPasswordError("Password must be at least 8 characters long and contain an uppercase letter and a special character.");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (hasError) {
            setDisplayCircularProcessing(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/user-signup/signup", {
                firstName,
                lastName,
                userName,
                password,
            });

            console.log("The response is: ", response);

            if (response.status === 201) {
                navigate("/login");
            }
        } catch (error: any) {
            setDisplayCircularProcessing(false);
            if (error.response.status === 400 && error.response.data.message === "User already exists") {
                setUserNameError("User already exists");
            }
            else{
                alert("An error occurred. Please try again later");
            }
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
                <Typography component="h2" variant="h3">
                    BidMe
                </Typography>

                <Box sx={{ mb: 3 }} />

                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlined />
                </Avatar>

                <Typography component="h1" variant="h5">
                    User Sign up
                </Typography>

                <Box component="form" 
                    onSubmit={submitHandler} 
                    sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                error={Boolean(firstNameError)}
                                helperText={firstNameError}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastname"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                error={Boolean(lastNameError)}
                                helperText={lastNameError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="userName"
                                autoComplete="email"
                                error={Boolean(userNameError)}
                                helperText={userNameError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={Boolean(passwordError)}
                                helperText={passwordError}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        {displayCircularProcessing && <CircularProgress />}
                    </Box>

                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/login");
                                }}
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {/* <Copyright sx={{ mt: 5 }} /> */}
        </Container>
    );
}

export default UserSignUp;