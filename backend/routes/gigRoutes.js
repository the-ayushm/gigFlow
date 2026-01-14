import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createGig,
  getMyGigs,
  getAllGigs,
  getGigById
} from "../controllers/gigController.js";

const router = express.Router();

router.get("/", getAllGigs);
router.get("/my", auth, getMyGigs);
router.get("/:id", getGigById);
router.post("/", auth, createGig);

export default router;
