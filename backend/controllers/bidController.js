import Bid from "../models/bid.model.js";
import Gig from "../models/gig.model.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, amount, message } = req.body;

    if (!gigId || !amount || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own gig" });
    }

    const alreadyBid = await Bid.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (alreadyBid) {
      return res.status(400).json({ message: "You already placed a bid" });
    }

    const bid = await Bid.create({
      gig: gigId,
      user: req.user._id,
      amount: amount,
      message: message,
      status: "pending",
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gig: gigId }).populate(
      "user",
      "firstName lastName email"
    );

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const hireFreelancer = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gig);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    bid.status = "hired";
    await bid.save();

    await Bid.updateMany(
      { gig: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.status(200).json({
      message: "Freelancer hired successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkMyBid = async (req, res) => {
  try {
    const { gigId } = req.params;

    const bid = await Bid.findOne({
      gig: gigId,
      user: req.user._id,
    });

    if (bid) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
