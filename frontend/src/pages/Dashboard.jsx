import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gigs/my");
      setGigs(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async (gigId) => {
    try {
      const res = await api.get(`/bids/${gigId}`);
      setBids(res.data);
      setSelectedGig(gigId);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  const hire = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      toast.success("Freelancer hired successfully!");
      loadBids(selectedGig);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error(err.response?.data?.message || "Failed to hire");
      }
    }
  };

  const createGig = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await api.post("/gigs", form);
      toast.success("Gig created successfully!");
      setForm({ title: "", description: "", budget: "" });
      setShowModal(false);
      fetchGigs();
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error(err.response?.data?.message || "Failed to create gig");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Manage your gigs and hire freelancers
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
          >
            + Create Gig
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-900">My Gigs</h2>

          {loading && (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}

          {!loading && gigs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">You haven't created any gigs yet</p>
              <p className="text-gray-400 text-sm">Click "Create Gig" to get started</p>
            </div>
          )}

          {!loading && gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => loadBids(gig._id)}
              className={`p-4 mb-3 rounded-lg cursor-pointer border transition-colors ${
                selectedGig === gig._id
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              <h3 className="font-semibold text-base mb-2">{gig.title}</h3>
              <p className="text-sm">₹{gig.budget}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-5 text-gray-900">Bids</h2>

          {!selectedGig && (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a gig to view bids</p>
            </div>
          )}

          {selectedGig && bids.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bids yet for this gig</p>
              <p className="text-gray-400 text-sm mt-1">Bids will appear here when freelancers apply</p>
            </div>
          )}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="border border-gray-200 rounded-lg p-5 mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg text-gray-900 mb-1">
                    {bid.user.firstName} {bid.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Bid Amount: <span className="font-medium text-gray-900">₹{bid.amount}</span>
                  </p>
                  <p className="text-sm">
                    Status: <span className={`font-medium ${
                      bid.status === "hired" ? "text-green-600" : "text-gray-600"
                    }`}>
                      {bid.status}
                    </span>
                  </p>
                </div>

                {bid.status === "pending" && (
                  <button
                    onClick={() => hire(bid._id)}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                  >
                    Hire
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                <p className="text-sm text-gray-600 leading-relaxed">{bid.message}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              Create New Gig
            </h2>

            <form onSubmit={createGig}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter gig title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Describe the gig..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) - Optional
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter budget"
                  value={form.budget}
                  onChange={(e) =>
                    setForm({ ...form, budget: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
