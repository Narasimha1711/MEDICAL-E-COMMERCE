import "./sellerList.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SellerList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sellers"); // Replace with actual API URL
        setData(response.data.message);
      } catch (error) {
        console.error("Error fetching the seller data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="sellerList">
      <table className="sellerTable">
        <thead>
          <tr>
            <th>Seller</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              <td>
                <div className="sellerListUser">{row.shopName}</div>
              </td>
              <td>{row.email}</td>
              <td>Active</td>
              <td>
                <Link to={"/seller/" + row._id}>
                  <button className="sellerListEdit">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
