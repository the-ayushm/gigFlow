import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/gigs/${id}`).then(res => setGig(res.data));
  }, []);

  const bid = async () => {
    await api.post("/bids", { gigId: id, price, message });
    alert("Bid placed");
  };

  if (!gig) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl">{gig.title}</h1>
      <p>{gig.description}</p>

      <div className="mt-4">
        <input className="input" placeholder="Price"
          onChange={e => setPrice(e.target.value)} />
        <textarea className="input mt-2" placeholder="Message"
          onChange={e => setMessage(e.target.value)} />
        <button className="btn mt-2" onClick={bid}>Place Bid</button>
      </div>
    </div>
  );
}
