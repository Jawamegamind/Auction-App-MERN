# BidMe - Your One-Stop Auction Solution

## 🚀 Setup Guide

To run the LMS locally, follow the steps below for both the **frontend** and **backend**:

---

### 📦 Frontend (Vite + React JS)

1. Navigate to the `lms-frontend` folder:

    ```bash
    cd frontend
    ```

2. Install project dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

4. Your browser will automatically open to the landing page. If it doesn't visit the following link:

    ```
    http://localhost:3000
    ```

---

### 🐍 Backend (Node JS + Express)

1. Navigate to the `backend` folder:

    ```bash
    cd backend
    ```

2. Install required dependencies:

    ```bash
    npm install
    ```

3. **Set up MongoDB Atlas:**

    - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account (or log in if you already have one).
    - Create a new project and then a **free cluster**.
    - Under **Database Access**, create a new database user with a password.
    - Under **Network Access**, allow access from your IP address (or `0.0.0.0/0` for access from anywhere, though this is less secure).
    - Once the cluster is created, click **Connect** → **Connect your application** → copy the connection string.

    Example connection string:

    ```
    mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```

    - Create a `.env` file in the `backend` directory and add the following line:

    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```

    Replace `<username>`, `<password>`, and `<dbname>` with your actual database credentials.

4. Start the server:

    ```bash
    npm run dev
    ```
---

## ✨ Features

- 🔐 **Authentication System** – Secure sign-up and login with unique usernames.
- 🏠 **Home & Navigation** – Intuitive routing with a persistent Navbar (excluding login/signup).
- 📦 **Create Auctions** – Post auctions with details like title, description, starting price, and timings.
- ⏱️ **Real-Time Bidding** – Users can place real-time bids using WebSockets.
- 🔍 **Browse Auctions** – Filter ongoing auctions by title and view auction details.
- 👤 **User Profile** – View created auctions, item count, and manage account settings.
- 🛠️ **Change Password** – Update credentials securely.
- 🚫 **Bid Validation** – Prevent bidding below the current price or on your own auctions.
- 🏁 **Timed Auction End** – Auctions automatically end at their specified time for all users.

---
