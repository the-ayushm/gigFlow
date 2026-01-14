import express from "express";
import { createBid, getBidsForGig } from "../controllers/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { hireFreelancer } from "../controllers/bidController.js";


const router = express.Router();

router.post("/", authMiddleware, createBid);
router.patch("/:bidId/hire", authMiddleware, hireFreelancer);
router.get("/:gigId", authMiddleware, getBidsForGig);


export default router;
