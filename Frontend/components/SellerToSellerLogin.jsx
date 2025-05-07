import React, { useState } from "react";
import axios from "axios";

const SellerToSellerLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/seller2seller/login", { email, password });
      onLogin(res.data.seller); // Pass seller info up
    } catch (err) {
      setError("Invalid login details");
    }
  };

  return (
    <div className="seller2seller-login">
      <h2>Seller-to-Seller Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
};

export default SellerToSellerLogin;
