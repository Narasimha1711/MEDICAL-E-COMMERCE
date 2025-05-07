import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerToSellerPage = ({ seller }) => {
  if (!seller || !seller._id || seller._id.length !== 24) {
    return <div>Please log in as a seller to view B2B requests.</div>;
  }
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/seller2seller/requests");
        setRequests(res.data);
      } catch (err) {
        setError("Failed to load requests");
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleFulfill = async (reqId) => {
    try {
      await axios.post("/api/seller2seller/fulfill", { reqId, sellerId: seller._id });
      setRequests(requests => requests.map(r => r._id === reqId ? { ...r, status: "fulfilled" } : r));
    } catch (err) {
      alert("Could not fulfill request");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="seller2seller-page">
      <h2>Seller-to-Seller Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.type}</td>
              <td>{req.medicineName}</td>
              <td>{req.quantity}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "pending" && req.sellerId !== seller._id && (
                  <button onClick={() => handleFulfill(req._id)}>Fulfill</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerToSellerPage;
