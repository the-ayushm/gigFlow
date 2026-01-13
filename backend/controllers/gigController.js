import Gig from "../models/gig.model.js";

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
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
    const { search } = req.query;

    let filter = { status: "open" };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const gigs = await Gig.find(filter)
      .populate("ownerId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("ownerId", "firstName lastName email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
