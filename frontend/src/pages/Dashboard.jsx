import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    const res = await api.get("/gigs/my");
    setGigs(res.data);
  };

  const loadBids = async (gigId) => {
    const res = await api.get(`/bids/${gigId}`);
    setBids(res.data);
    setSelectedGig(gigId);
  };

  const hire = async (bidId) => {
    await api.patch(`/bids/${bidId}/hire`);
    loadBids(selectedGig);
  };

  const createGig = async (e) => {
    e.preventDefault();
    await api.post("/gigs", form);
    setForm({ title: "", description: "", budget: "" });
    setShowModal(false);
    fetchGigs();
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
        {/* Gigs */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">My Gigs</h2>

          {gigs.length === 0 && (
            <p className="text-gray-500 text-sm">
              No gigs yet. Create your first gig 🚀
            </p>
          )}

          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => loadBids(gig._id)}
              className={`p-3 mb-3 rounded cursor-pointer border ${
                selectedGig === gig._id
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <h3 className="font-semibold">{gig.title}</h3>
              <p className="text-sm">₹{gig.budget}</p>
            </div>
          ))}
        </div>

        {/* Bids */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Bids</h2>

          {!selectedGig && (
            <p className="text-gray-500">
              Select a gig to view bids
            </p>
          )}

          {selectedGig && bids.length === 0 && (
            <p className="text-gray-500">
              No bids yet for this gig.
            </p>
          )}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="border rounded p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {bid.freelancerId.firstName}{" "}
                  {bid.freelancerId.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  ₹{bid.price}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-medium">
                    {bid.status}
                  </span>
                </p>
              </div>

              {bid.status === "pending" && (
                <button
                  onClick={() => hire(bid._id)}
                  className="px-4 py-2 bg-black text-white rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
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
                placeholder="Budget (₹)"
                value={form.budget}
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
