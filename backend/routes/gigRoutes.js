import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createGig,
  getMyGigs,
  getAllGigs,
  getGigById,
  deleteGig
} from "../controllers/gigController.js";

const router = express.Router();

router.get("/", getAllGigs);
router.get("/my", auth, getMyGigs);
router.get("/:id", getGigById);
router.post("/", auth, createGig);
router.delete("/:id", auth, deleteGig);

export default router;
