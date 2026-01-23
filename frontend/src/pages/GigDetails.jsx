import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function GigDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyBid, setAlreadyBid] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        setGig(res.data);
        
        if (user && res.data.user._id === user.id) {
          setIsOwner(true);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    fetchGig();
  }, [id, user]);

  useEffect(() => {
    if (!user || isOwner) return;

    const checkBid = async () => {
      try {
        const res = await api.get(`/bids/${id}/me`);
        if (res.data.exists) {
          setAlreadyBid(true);
        }
      } catch (err) {
      }
    };

    checkBid();
  }, [id, user, isOwner]);

  const bid = async () => {
    if (!amount) {
      setError("Enter bid amount");
      return;
    }

    if (!message) {
      setError("Enter a message explaining why you should be hired");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/bids", { gigId: id, amount, message });

      toast.success("Bid placed successfully!");
      setAlreadyBid(true);
      setAmount("");
      setMessage("");
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{gig.title}</h1>
          
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-lg text-gray-700 font-medium mb-2">Budget: ₹{gig.budget}</p>
            <p className="text-gray-700 leading-relaxed">{gig.description}</p>
          </div>

          {user && !isOwner && !alreadyBid && (
            <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-5 text-gray-900">Place Your Bid</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your bid amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why should you be hired?
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Explain your experience and approach..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  required
                />
              </div>

              <button
                disabled={loading || !amount || !message}
                onClick={bid}
                className="w-full px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          )}

          {user && !isOwner && alreadyBid && (
            <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-blue-50">
              <p className="text-gray-700 font-medium">
                You have already placed a bid on this gig
              </p>
            </div>
          )}

          {user && isOwner && (
            <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-gray-50">
              <p className="text-gray-700">
                This is your gig. View bids in your dashboard.
              </p>
            </div>
          )}

          {!user && (
            <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-gray-50">
              <p className="text-gray-700 mb-3">
                Please login to place a bid on this gig
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
