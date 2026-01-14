import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function GigDetails() {
  const { id } = useParams();

  const [gig, setGig] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyBid, setAlreadyBid] = useState(false);

  useEffect(() => {
    api.get(`/gigs/${id}`).then(res => setGig(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/bids/${id}/me`).then(res => {
      if (res.data) setAlreadyBid(true);
    });
  }, [id]);

  const bid = async () => {
    if (!price) return setError("Enter bid amount");

    try {
      setLoading(true);
      setError("");

      await api.post("/bids", { gigId: id, price, message });

      toast.success("Bid placed successfully!");
      setAlreadyBid(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!gig) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{gig.title}</h1>
      <p className="text-gray-600 mb-4">{gig.description}</p>

      {alreadyBid && (
        <p className="text-sm text-gray-500">
          You have already placed a bid on this gig
        </p>
      )}

      {!alreadyBid && (
        <div className="mt-4">
          {error && (
            <p className="text-red-500 text-sm mb-2">
              {error}
            </p>
          )}

          <input
            className="input"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <textarea
            className="input mt-2"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={bid}
            className={`btn w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Placing Bid..." : "Place Bid"}
          </button>
        </div>
      )}
    </div>
  );
}
