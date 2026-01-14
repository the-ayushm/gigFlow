import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBid,
  getBidsForGig,
  hireFreelancer
} from "../controllers/bidController.js";

const router = express.Router();

router.post("/", auth, createBid);
router.get("/:gigId", auth, getBidsForGig);
router.patch("/:bidId/hire", auth, hireFreelancer);

export default router;
