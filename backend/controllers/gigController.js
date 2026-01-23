import Gig from "../models/gig.model.js";

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget: budget,
      user: req.user._id,
      status: "open",
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await gig.deleteOne();

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
