import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/gigs");
        setGigs(res.data);
      } catch (err) {
        // Error handled by interceptor
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Open Gigs</h1>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {!loading && gigs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No gigs available at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities</p>
        </div>
      )}

      {!loading &&
        gigs.map((gig) => (
          <div key={gig._id} className="bg-white border-2 border-gray-200 rounded-lg shadow-md p-5 mb-4">
            <h2 className="font-bold text-xl mb-2 text-gray-800">{gig.title}</h2>
            <p className="text-sm text-gray-600 mb-2">Budget: ₹{gig.budget}</p>
            <p className="text-sm text-gray-700 mb-4">
              {gig.description?.length > 120
                ? gig.description.slice(0, 120) + "..."
                : gig.description}
            </p>

            <div>
              <Link
                to={`/gigs/${gig._id}`}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 inline-block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
