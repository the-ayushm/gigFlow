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
      // Error handled by interceptor
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
      // Error handled by interceptor
    }
  };

  const hire = async (bidId) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      toast.success("Freelancer hired successfully!");
      // Refresh bids list after hiring
      loadBids(selectedGig);
    } catch (err) {
      if (err.response?.status !== 401) {
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
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Failed to create gig");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Manage your gigs and hire freelancers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          + Create Gig
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Gigs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Gigs</h2>

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
              className={`p-4 mb-3 rounded-lg cursor-pointer border-2 transition-colors ${
                selectedGig === gig._id
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <h3 className="font-semibold text-base mb-1">{gig.title}</h3>
              <p className="text-sm">₹{gig.budget}</p>
            </div>
          ))}
        </div>

        {/* Bids Section */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Bids</h2>

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
              className="border-2 border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {bid.user.firstName} {bid.user.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ₹{bid.amount}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-medium text-gray-700">{bid.status}</span>
                </p>
              </div>

              {bid.status === "pending" && (
                <button
                  onClick={() => hire(bid._id)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Hire
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE GIG MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create New Gig
            </h2>

            <form onSubmit={createGig}>
              <input
                className="input mb-3"
                placeholder="Gig Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <textarea
                className="input mb-3"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                className="input mb-4"
                placeholder="Budget (₹) - Optional"
                value={form.budget}
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
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
