import React from "react";
import io from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./context/UserContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import UserPasswordChange from "./pages/UserPasswordChange";
import CreateAuction from "./pages/CreateAuction";
import Browse from "./pages/Browse";
import Auction from "./pages/Auction";

// Making a socket to connect the frontend to the backend
const socket = io("http://localhost:8000");

function App() {
  const sendMessage = () => {
    socket.emit("message", "Hello World");
  }
  
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}> 
            <Route path="/home" element={<Home />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/change-password" element={<UserPasswordChange />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/auction/:id" element={<Auction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;