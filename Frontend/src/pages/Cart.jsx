import React, { useEffect, useState, useRef } from 'react';
import './cart.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const Cart = () => {
  const toast = useRef(null);

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'All items in Cart Booked Successfully', life: 3000 });
  };

  const bookAllCart = async () => {
    try {
      const response = await fetch('http://localhost:9001/bookAllCart', {
        method: 'GET',
        credentials: 'include' // To include cookies, similar to axios defaults
      });

      if (response.ok) {
        showSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error booking cart:', errorData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:9001/addToCart', {
          method: 'GET',
          credentials: 'include' // To include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items);
        } else {
          console.error('Error fetching cart items:', response.statusText);
        }
      } catch (err) {
        console.log('Fetch error:', err);
      }
    };
    fetchCartItems();
  }, []);

  // Calculate total price outside the rendering loop
  const totalPrice = cartItems.reduce((acc, medicine) => acc + medicine.price, 0);

  return (
    <>
      <div className="cart-page">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <p>{cartItems.length === 0 ? 'Your cart is empty.' : `You have ${cartItems.length} item(s) in your cart.`}</p>
        </div>

        <div className="cart-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img src="/empty-cart.png" alt="Empty Cart" />
              <p>Looks like you haven't added anything yet!</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((medicine) => (
                <div key={medicine._id} className="medicine-card">
                  <div className="medicine-image">
                    <img src={`http://localhost:9001/uploads/${medicine.image}`} alt={medicine.name} />
                  </div>
                  <div className="medicine-info">
                    <h2 className="medicine-name">{medicine.name}</h2>
                    <p className="medicine-description">{medicine.description}</p>
                    <p className="medicine-seller">Seller: {medicine.seller}</p>
                    <p className="medicine-price">Price: ₹{medicine.price}</p>
                    <button className="buy-btn">Buy Now</button>
                  </div>
                </div>
              ))}
              {/* Display the total price at the bottom, calculated beforehand */}
              <div className="cart-summary">
                <h3 className="cart-total">Total: ₹{totalPrice.toFixed(2)}</h3>
                <button className="checkout-btn" onClick={bookAllCart}>Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
