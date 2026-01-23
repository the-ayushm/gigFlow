import mongoose from 'mongoose'

const bidSchema = new mongoose.Schema({
    gig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "hired"],
        default: "pending",
    },
}, {timestamps: true});

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;