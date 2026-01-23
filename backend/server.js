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

// Needed on Render/other proxies so secure cookies work correctly.
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173"];
const allowedOrigins = [
  ...DEFAULT_ALLOWED_ORIGINS,
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (Postman, curl) with no Origin header
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

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
