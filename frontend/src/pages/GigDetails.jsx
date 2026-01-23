import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function GigDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyBid, setAlreadyBid] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch gig details
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
        
        // Check if logged-in user is the owner
        if (user && res.data.user._id === user.id) {
          setIsOwner(true);
        }
      } catch (err) {
        // Error handled by interceptor
      }
    };

    fetchGig();
  }, [id, user]);

  // Check if user already bid
  useEffect(() => {
    if (!user || isOwner) return;

    const checkBid = async () => {
      try {
        const res = await api.get(`/bids/${id}/me`);
        if (res.data.exists) {
          setAlreadyBid(true);
        }
      } catch (err) {
        // If not logged in or error, just continue
      }
    };

    checkBid();
  }, [id, user, isOwner]);

  const bid = async () => {
    if (!amount) {
      setError("Enter bid amount");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/bids", { gigId: id, amount });

      toast.success("Bid placed successfully!");
      setAlreadyBid(true);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">{gig.title}</h1>
        <p className="text-lg text-gray-600 mb-3">Budget: ₹{gig.budget}</p>
        <p className="text-gray-700 mb-6 leading-relaxed">{gig.description}</p>

        {/* Show bid form only if user is logged in, not owner, and hasn't bid */}
        {user && !isOwner && !alreadyBid && (
          <div className="mt-6 border-2 border-gray-200 rounded-lg p-5 bg-gray-50">
            <h2 className="font-semibold mb-4 text-gray-800">Place Your Bid</h2>
            
            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <input
              type="number"
              className="input mb-3"
              placeholder="Bid Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button
              disabled={loading}
              onClick={bid}
              className="px-4 py-2 bg-black text-white rounded-lg w-full hover:bg-gray-800"
            >
              {loading ? "Placing Bid..." : "Place Bid"}
            </button>
          </div>
        )}

        {/* Show message if user already bid */}
        {user && !isOwner && alreadyBid && (
          <div className="mt-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-700 font-medium">
              You have already placed a bid on this gig
            </p>
          </div>
        )}

        {/* Show message if user is owner */}
        {user && isOwner && (
          <div className="mt-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-700">
              This is your gig. View bids in your dashboard.
            </p>
          </div>
        )}

        {/* Show message if not logged in */}
        {!user && (
          <div className="mt-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-700">
              Please login to place a bid
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
