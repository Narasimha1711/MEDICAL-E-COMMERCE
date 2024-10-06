import React, { useContext, useEffect } from 'react';
import { SearchContextCreate } from '../SearchContext';
import './searchedItems.css';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Optional: Search icon for illustration
import NoProducts from './NoProducts';

const SearchedItems = () => {
    const { searchItems, setSearchItems } = useContext(SearchContextCreate);

    useEffect(() => {
        const storedSearchItems = localStorage.getItem('searchItems');
        console.log("changing", searchItems)
        if (storedSearchItems) {
            setSearchItems(JSON.parse(storedSearchItems));
            console.log("Heloo", searchItems)
        }
    }, [setSearchItems]);

    const addToCart = async (_id) => {
        // console.log(_id);
        const response = await axios.post('/addToCart', { id: _id });

        // console.log(response.data.message);
    };

    const buy = async (_id) => {
        // console.log(_id);
        const response = await axios.post('/buy', { id: _id });
        // console.log(response.data.message);
    };

    return (
        <>
            {searchItems.length === 0 ? (
                <NoProducts />
            ) : (
                <div className="medicines-list">
                    {searchItems.map((medicine) => (
                        <div key={medicine._id} className="medicine-card">
                            <div className="medicine-image">
                                <img src={`http://localhost:9001/uploads/${medicine.image}`} alt={medicine.name} />
                            </div>
                            <div className="medicine-info">
                                <h2 className="medicine-name">{medicine.name}</h2>
                                <p className="medicine-description">{medicine.description}</p>
                                <p className="medicine-seller">Seller: {medicine.seller}</p>
                                <p className="medicine-price">Price: ₹{medicine.price}</p>
                                <button className="buy-btn" style={{ fontWeight: '800' }} onClick={() => { buy(medicine._id) }} >Buy Now</button>
                                <button className="cart-btn" style={{ fontWeight: '800' }} onClick={() => { addToCart(medicine._id) }}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default SearchedItems;
