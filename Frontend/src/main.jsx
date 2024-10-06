import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import axios from 'axios'
import SellerContext, { SellerContextData } from './SellerContext.jsx'
import SearchContext from './SearchContext.jsx'

axios.defaults.baseURL = 'http://localhost:9001'
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>

    {/* <SellerContext> */}
    <SearchContext>
    <SellerContext>

     <App />
     
    </SellerContext>
    </SearchContext>
    {/* </SellerContext> */}
    
    </BrowserRouter>
  </StrictMode>,
)
