import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import UserImage from "../assets/user.png";
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';


function Navbar() {
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const redirectToProfile = () => {
        navigate("/user-profile");
    }

    const redirectToHome = () => {
        navigate("/home");
    }

    const redirectToBrowse = () => {
        navigate("/browse");
    }

    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem("user");
        console.log("User has been successfully logged out")
        navigate("/");
    }

    return (
        <React.Fragment>
        <CssBaseline /> {/* use it here */}
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                BidMe
                </Typography>
                <Button color="inherit" onClick={redirectToHome}>Home</Button>
                <Button color="inherit" onClick={redirectToBrowse}>Browse</Button>
                <Button color="inherit" onClick={redirectToProfile}>
                    <img src={UserImage} width="40px" />
                </Button>
                <Button color="inherit" className="logout" onClick={handleSignOut}>Logout</Button>
            </Toolbar>
            </AppBar>
        </Box>
        </React.Fragment>
    );
}

export default Navbar;