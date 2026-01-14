import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    api.get("/gigs").then(res => setGigs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Open Gigs</h1>
      {gigs.map(gig => (
        <div key={gig._id} className="border p-4 mb-3">
          <h2 className="font-bold">{gig.title}</h2>
          <p>{gig.description}</p>
          <Link to={`/gigs/${gig._id}`} className="text-blue-600">View</Link>
        </div>
      ))}
    </div>
  );
}
