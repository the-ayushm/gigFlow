import cookieParser from 'cookie-parser';
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes.js"
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","https://gig-flow-servicehive.netlify.app"],
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);



const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend Running!")
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
