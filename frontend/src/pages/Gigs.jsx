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
        if (err.response?.status === 401) {
          window.location.href = "/login";
        } else {
          setGigs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Open Gigs</h1>
        
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {!loading && gigs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-lg mb-2">No gigs available at the moment</p>
            <p className="text-gray-400 text-sm">Check back later for new opportunities</p>
          </div>
        )}

        <div className="space-y-4">
          {!loading &&
            gigs.map((gig) => (
              <div 
                key={gig._id} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="font-bold text-xl mb-3 text-gray-900">{gig.title}</h2>
                <p className="text-gray-600 mb-3 font-medium">Budget: ₹{gig.budget}</p>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {gig.description?.length > 150
                    ? gig.description.slice(0, 150) + "..."
                    : gig.description}
                </p>

                <Link
                  to={`/gigs/${gig._id}`}
                  className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
