import Bid from "../models/bid.model.js";
import Gig from "../models/gig.model.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, amount } = req.body;

    // Check if all required fields are provided
    if (!gigId || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Check if user is trying to bid on their own gig
    if (gig.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own gig" });
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({ message: "Bid already exists" });
    }

    // Create the bid
    const bid = await Bid.create({
      gig: gigId,
      user: req.user._id,
      amount: Number(amount),
    });

    res.status(201).json({
      message: "Bid created successfully",
      bid,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Find the gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only gig owner can see bids
    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all bids for this gig
    const bids = await Bid.find({ gig: gigId })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const hireFreelancer = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Find the gig
    const gig = await Gig.findById(bid.gig);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only gig owner can hire
    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update bid status to hired
    bid.status = "hired";
    await bid.save();

    res.json({
      message: "Freelancer hired successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Check if current user already bid on a gig
export const checkMyBid = async (req, res) => {
  try {
    const { gigId } = req.params;

    const bid = await Bid.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (bid) {
      res.json({ exists: true, bid });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

