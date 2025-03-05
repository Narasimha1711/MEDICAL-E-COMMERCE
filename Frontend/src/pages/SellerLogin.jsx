/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import IMAGE from '../assets/MedicineGif.gif';
import IMAGE_2 from '../assets/Medicine2Gif.gif';
import { SellerContextData } from '../SellerContext';
import './SellerLogin.css';

export default function SellerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setSellerData } = useContext(SellerContextData);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9001/sellerLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setSellerData(data.seller);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="seller-login-container">
      <div className="background-images">
        <img src={IMAGE} alt="Medicine illustration 1" className="img1" />
        <img src={IMAGE_2} alt="Medicine illustration 2" className="img2" />
      </div>

      <div className="login-wrapper">
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          
          <div className="login-input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="login-input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="login-remember-forget">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>

          {error && <div className="login-error">{error}</div>}

          <div className="login-register-link">
            <p>
              Don't have an account?{' '}
              <Link to="/sellersignup">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}