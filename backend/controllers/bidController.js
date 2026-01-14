import Bid from "../models/bid.model.js";
import Gig from "../models/gig.model.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res.status(400).json({ message: "Gig not available" });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({ message: "You had already bid on this gig!" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json({
      message: "Bid created successfully",
      bid,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "firstName lastName email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const hireFreelancer = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the owner of this Gig!" });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    gig.status = "assigned";
    await gig.save();

    bid.status = "hired";
    await bid.save();

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.json({
      message: "Freelancer hired successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

