import React from 'react';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useAddToCartMutation } from '../app/addCartSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCartCount } from '../app/userSlice';

// const ProductCard = ({ product, userLocation, addToCart, distance }) => {
const ProductCard = ({ product }) => {


    const dispatch = useDispatch();
    const navigate = useNavigate()


    const [addToCartFun, { error: errorCart, isError: isErrorCart, isLoading: isLoadingCart, data: dataCart }] = useAddToCartMutation();

    const addToCart = (id) => {
        addToCartFun({id: id}) 
    }

    const [userLocation, setUserLocation] = useState([]);
    
    const distance = (lat1, lat2, lon1, lon2) => {
        // The math module contains a function
      // named toRadians which converts from
      // degrees to radians.
  
      // console.log(lat1, lat2, lon1, lon2)
      lon1 =  lon1 * Math.PI / 180;
      lon2 = lon2 * Math.PI / 180;
      lat1 = lat1 * Math.PI / 180;
      lat2 = lat2 * Math.PI / 180;
  
      // Haversine formula 
      let dlon = lon2 - lon1; 
      let dlat = lat2 - lat1;
      let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2),2);
  
      let c = 2 * Math.asin(Math.sqrt(a));
  
      // Radius of earth in kilometers. Use 3956 
      // for miles
      let r = 6371;
  
      // calculate the result
      // console.log(c)
      // console.log(c*r)
      return(c * r);
      }


      useEffect(() => {

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            const userLoc = [latitude, longitude]
            // if(userLoc.length && products.length) {
  
              setUserLocation(userLoc)
            // }
  
            
          });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
  
  
      }, [])


      useEffect(() => {
        if(dataCart) {
        
            // console.log(dataCart)
            if(dataCart.message === 'Added to cart') {
              dispatch(getCartCount(dataCart.items.length));
              // dispatch(getCartCount(1));

              // setNotificationMessage("Item added to Cart");
              // setShowNotification(true);
              // setType("success");
              const id = toast.loading("Please wait...")
              toast.update(id, {
                render: "Item added to Cart",
                type: "success",
                isLoading: false,
                autoClose: 3000, // Closes the toast after 3 seconds
              });

            //   console.log("Triggered once")
            }

            else if(dataCart.message === 'Item is already present in Cart') {
              
              // setNotificationMessage("Item is already present in Cart");
              // setShowNotification(true);
              // setType("info");
              let id = toast.loading("Please Wait...")

             setTimeout(() => {

               toast.update(id, {
                 render: "Item is already present in Cart",
                 type: "info",
                 isLoading: false,
                 autoClose: 3000, // Closes the toast after 3 seconds
                });
              }, 1000)
            //   console.log("Triggered once")
            }
        }
    }, [dataCart])


      



  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={`http://localhost:9001/uploads/${product.image}`} 
          className="w-full h-48 object-cover" 
          alt={product.name}
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          -{product.discount}%
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-gray-600">{product.rating || 2+Math.ceil(Math.random()*3)}</span>
          </div>
          <div className="ml-4 text-sm text-gray-500">
            {distance(product.location[0], userLocation[0], product.location[1], userLocation[1]).toFixed(2)} km away
          </div>
        </div>
        
        <div className="mb-3">
          <span className="text-2xl font-bold text-gray-800">₹{product.discountedPrice}</span>
          <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${product.count > 0 ? (product.count <= 5 ? 'text-orange-500': 'text-green-500') : 'text-red-500'} font-semibold`}>
            {product.count > 0 ? (product.count <= 5 ? `${product.count} are left` : 'In Stock') : 'Out of Stock'}
          </span>
          
          <button 
            onClick={() => addToCart(product._id)}
            className={`flex items-center px-4 py-2 rounded-full ${
              product.count > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            } transition-colors duration-300`}
            disabled={!product.count}
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;