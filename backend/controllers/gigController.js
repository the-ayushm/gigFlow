import Gig from "../models/gig.model.js";

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Title and description are required
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Budget is optional, but if provided, must be a valid number
    let budgetNumber = 0;
    if (budget) {
      budgetNumber = Number(budget);
      if (Number.isNaN(budgetNumber) || budgetNumber < 0) {
        return res.status(400).json({ message: "Budget must be a valid number" });
      }
    }

    const gig = await Gig.create({
      title,
      description,
      budget: budgetNumber,
      user: req.user._id,
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
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("user", "firstName lastName email");

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
    const gigs = await Gig.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
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
    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
