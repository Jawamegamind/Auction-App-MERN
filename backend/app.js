import express from "express";
import cors from "cors";
import { router as signupRouter } from './routes/signupRoute.js';
import { router as loginRouter } from './routes/loginRoute.js';
import {router as auctionRouter} from './routes/auctionRoute.js';
import {router as userRouter} from './routes/userRoute.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Defining the routes with all the imported routers
app.use('/api/user-signup', signupRouter);
app.use('/api/user-login', loginRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/user', userRouter);