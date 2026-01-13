import cookieParser from 'cookie-parser';
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

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
