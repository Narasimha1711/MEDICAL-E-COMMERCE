import React, { useContext, useEffect, useState } from 'react';
import './header.css';
import { ContextData } from '../Context';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { SearchContextCreate } from '../SearchContext';
import { Badge } from 'antd';

export default function Header() {
    const { userData, setUserData } = useContext(ContextData);
    const { searchItems, setSearchItems } = useContext(SearchContextCreate);
    const { searchItem, setSearchItem } = useContext(SearchContextCreate);

    const [cartCount, setCartCount] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if(searchItem !== "") {

                const response = await axios.post('/allMedicines', { searchItem });
                const medicines = response.data;
                setSearchItems(medicines);
                console.log("Hie")
                // if (medicines.length > 0) {
                    localStorage.setItem('searchItems', JSON.stringify(medicines));
                }
            // }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    useEffect(() => {
        const UserDetails = async () => {
            try {
                const response = await axios.get('/user-info');
                const data = response.data; 
                setUserData(data);
                console.log(data.cart.length)
                setCartCount(data.cart.length);
                console.log(data.cart.length)
            } catch (err) {
                console.log(err);
                if (err.response.data.path === "/login") {
                    navigate('/login');
                }
            }
        };

        UserDetails();

    }, [searchItems, setSearchItems]);

    

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const logout = () => {
        localStorage.removeItem('searchItems');
        navigate('/login');
    };

    const handleLogoClick = () => {
        setSearchItems(null);
        setSearchItem('');
        localStorage.removeItem('searchItems');
        navigate('/'); 
    };

    return (
        <>
            <nav>
                <div>
                    <Link to='/' style={{ textDecoration: "none" }}>
                        <h1 onClick={handleLogoClick} style={{ color: "black" }}>Logo</h1>
                    </Link>
                </div>
                <div className="search-container">
                    <form onSubmit={onSubmit} method='POST'>
                        <input 
                            type='text' 
                            placeholder='Search' 
                            value={searchItem} 
                            onChange={(e) => { setSearchItem(e.target.value) }} 
                        />
                        <button type='submit'>Search</button>
                    </form>
                </div>
                <div className='cart_profile'>
                    <div className='cart'>
                        <Link to='/cart'>
                            <ShoppingCartIcon fontSize='large' style={{ color: "black" }} />
                        </Link>
                        <Badge count={cartCount} style={{ bottom: "2.3vw", right: "1vw" }} />
                    </div>


                    <div className='profile'>
                        {userData?.username && (
                            <FaUser 
                                onClick={toggleDropdown} 
                                style={{ transform: "scale(2)", position: 'relative', top: '-0.3rem' }} 
                            />
                        )}
                        {dropdownVisible && (
                            <div className={`dropdown-menu ${dropdownVisible ? 'visible' : ''}`}>
                                <ul>
                                    
                                    <Link to='/userDashboard' style={{textDecoration: "none"}}><li>Profile</li></Link>
                                    <li onClick={logout}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
