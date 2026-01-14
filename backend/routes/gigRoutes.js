import express from "express";
import {
  createGig,
  getAllGigs,
  getGigById,
} from "../controllers/gigController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyGigs } from "../controllers/gigController.js";


const router = express.Router();
router.get("/", getAllGigs);
router.get("/my", authMiddleware, getMyGigs);
router.get("/:id", getGigById);

router.post("/", authMiddleware, createGig);

export default router;
