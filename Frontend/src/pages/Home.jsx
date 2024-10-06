import React, { useContext, useEffect, useState } from 'react'
import { ContextData} from '../Context';
import './home.css'
import Card from '../Components/Card_med';
import Category from '../Components/Category';
import axios from 'axios';
import NormalHome from '../Components/NormalHome';
import SearchedItems from '../Components/SearchedItems';
import { SearchContextCreate } from '../SearchContext';

const Home = () => {
    
    const { userData } = useContext(ContextData);
    // const [search, setSearchItem] = useState('');
    const { searchItems, setSearchItems } = useContext(SearchContextCreate);
    const { searchItem, setSearchItem } = useContext(SearchContextCreate);

    useEffect(() => {

        const storedSearchItems = localStorage.getItem('searchItems');
        if (storedSearchItems !== JSON.stringify(searchItems)) {
            setSearchItems(JSON.parse(storedSearchItems));
        }

        
        
    })
    
    // useEffect(() => {
    //     const callAllMedicines = async () => {

    //         console.log(searchItem)
    //         const MedicinesList = await axios('/allMedicines', {searchItem: searchItem})
    //         searchItems(MedicinesList)
    //     }
        
        
    //     callAllMedicines();
    // }, [searchItem])

    
  return (
    <>


        

        { !searchItems && <NormalHome />}
        
        {searchItems && <SearchedItems />}

        



    
        
    </>
  )
}

export default Home
