import React from "react";
import Navbar from "../components/Navbar";
import { Box, Card, Typography, Button, TextField, Grid, Link, Container, CssBaseline } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserPasswordChange() {

    const isPasswordStrong = (password:string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
        const hasMinLength = password.length >= 8;
        return hasUpperCase && hasSpecialChar && hasMinLength;
    };

    const { user } = useContext(UserContext);

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e: any) => {
        e.preventDefault();
        let formData = Object.fromEntries(new FormData(e.target));
        const { currentPassword, newPassword } = formData;
        console.log("The form data is: ", formData);

        let hasError = false;

        if (!currentPassword) {
            setCurrentPasswordError("Current password is required");
            hasError = true;
        }
        else{
            setCurrentPasswordError("");
        }

        if (!newPassword) {
            setNewPasswordError("New password is required");
            hasError = true;
        } else if (!isPasswordStrong(String(newPassword))) {
            setNewPasswordError("Password must be at least 8 characters long and contain an uppercase letter and a special character.");
            hasError = true;
        }
        else {
            setNewPasswordError("");
        }

        try {
            const response = await axios.post("http://localhost:8000/api/user-login/change-password", {
                userName: user?.userName,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            console.log("The response is: ", response);

            if (response.status === 200) {
                console.log("Password has been successfully changed");
                navigate("/user-profile");
            }
        } catch (error:any) {
            console.log("An error occurred: ", error);
            if(error.response.status === 400 && error.response.data.message === "Invalid password"){
                setCurrentPasswordError("Invalid current password"); 
            }
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
                        Password Change
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
                            id="currentPassword"
                            label="Current Password"
                            name="currentPassword"
                            autoComplete="currentPassword"
                            autoFocus
                            type="password"
                            error = {Boolean(currentPasswordError)}
                            helperText = {currentPasswordError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type="password" // hide the password while typing
                            id="newPassword"
                            autoComplete="newPassword"
                            error = {Boolean(newPasswordError)}
                            helperText = {newPasswordError}
                        />
                        {/* Add some space before the radio button */}
                        <Box sx={{ mb: 1 }} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update Information
                        </Button>
                    </Box>
                </Box>
                {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
                {/* <ErrorModal /> */}
            </Container>
        </div>
    );
}

export default UserPasswordChange;