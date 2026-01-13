import express from "express";
import {
  createGig,
  getAllGigs,
  getGigById,
} from "../controllers/gigController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllGigs);
router.get("/:id", getGigById);

router.post("/", authMiddleware, createGig);

export default router;
