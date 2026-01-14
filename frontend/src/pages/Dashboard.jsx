import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    api.get("/gigs/my").then((res) => setGigs(res.data));
  }, []);

  const loadBids = async (gigId) => {
    const res = await api.get(`/bids/${gigId}`);
    setBids(res.data);
    setSelectedGig(gigId);
  };

  const hire = async (bidId) => {
    await api.patch(`/bids/${bidId}/hire`);
    alert("Freelancer hired successfully");
    loadBids(selectedGig);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Manage your gigs and hire freelancers
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT: Gigs List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">My Gigs</h2>

          {gigs.length === 0 && (
            <p className="text-gray-500 text-sm">
              You haven’t posted any gigs yet.
            </p>
          )}

          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => loadBids(gig._id)}
              className={`p-3 mb-3 rounded-lg cursor-pointer border 
                ${
                  selectedGig === gig._id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              <h3 className="font-semibold">{gig.title}</h3>
              <p className="text-sm">
                Status:{" "}
                <span className="font-medium capitalize">
                  {gig.status}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: Bids Section */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Bids</h2>

          {!selectedGig && (
            <p className="text-gray-500">
              Select a gig to view bids
            </p>
          )}

          {selectedGig && bids.length === 0 && (
            <p className="text-gray-500">
              No bids received for this gig yet.
            </p>
          )}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="border rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {bid.freelancerId.firstName}{" "}
                  {bid.freelancerId.lastName}
                </p>
                <p className="text-gray-600 text-sm">
                  Bid Amount: ₹{bid.price}
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      bid.status === "hired"
                        ? "text-green-600"
                        : bid.status === "rejected"
                        ? "text-red-500"
                        : "text-yellow-600"
                    }`}
                  >
                    {bid.status}
                  </span>
                </p>
              </div>

              {bid.status === "pending" && (
                <button
                  onClick={() => hire(bid._id)}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Hire
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
