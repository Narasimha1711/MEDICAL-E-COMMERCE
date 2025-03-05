import React, { useContext, useEffect, useState } from 'react'
// import { ContextData} from '../Context';
import './normalHome.css'
// import Card from '../Components/Card_med';
// import Category from '../Components/Category';
import axios from 'axios';
import Card from './Card_med';
import Category from './Category';
import HeroSection from './HeroSection';
// import OrdersSection from './OrderSection';
import UserHomeOrderCard from './UserHomeOrderCard';
// import { ContextData } from '../Context';
import { useUserHomeCurrentOrdersQuery, useUserHomeTopDealsQuery } from '../app/addCartSlice';
import OrdersSection from './OrderSection';
import TopDealsSection from './TopDealsSections';



const NormalHome = () => {
  
  const { data: items, error, isLoading, isError } = useUserHomeCurrentOrdersQuery(undefined, {refetchOnMountOrArgChange: true})
  const { data: items1 } = useUserHomeTopDealsQuery(undefined, {refetchOnMountOrArgChange: true})

  const [orders, setOrders] = useState([])
  const [orders1, setOrders1] = useState([])

  useEffect(() => {
    if(items) {
      console.log("this", items.currentItems)
      setOrders(items.currentItems)
    } 
  }, [items])


  useEffect(() => {
    if(items1) {
      console.log("this", items1.items)
      setOrders1(items1.items)
    } 
  }, [items1])


  return (
    
    <div className="min-h-screen bg-gray-50">
    <HeroSection />
    <OrdersSection orders={orders} />
    <TopDealsSection 
      products={orders1}
      // userLocation={userLocation}
      // addToCart={addToCart}
      // distance={calculateDistance}
    />
    {/* <RecommendationsSection 
      products={recommendations}
      userLocation={userLocation}
      addToCart={addToCart}
      distance={calculateDistance}
    /> */}
  </div>
    // <div>
    //     <div className='image' style={{position: 'relative'}}>
    //     {/* <img src='/pexels-pixabay-208512.jpg' style={{width: '100%', height: "80vh"}}></img> */}
    //     {/* <img src='/narasimha2.jpg' style={{width: '100%', height: "80vh"}}></img> */}

    //     <div className="hero-section">
    //   <div className="content">
    //     <h5 className="subheading">WE'RE THE PHARMEDIC</h5>
    //     <h1 className="main-heading">Delivering Wellness with Every Prescription</h1>
    //     <p className="description">
    //       Euismod sapien eros mus imperdiet commodo tellus luctus. Eleifend
    //       ultrices primis litora turpis nisl donec euismod habitant erat dolor.
    //     </p>
    //     <button className="btn">Discover More</button>
    //   </div>
    // </div>
    //     {/* <div className='text' style={{color: "white", fontWeight: 700, fontSize: '2rem', position: "absolute", textAlign: 'center', bottom:'40vh', left: '30vw'}}>Buy Medicines and Essentials</div> */}
    //     </div>

    //     <div className='trending'>
    //         <div className='compo'>
    //             Top Deals 
    //         </div>
    //         <hr className='line_below'></hr>
    //         <div className='trending_medinces'>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 image='/product-photo-37909522022105225.webp'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 // image='/Parcetamol.jpg'
    //                 image='/product-photo-37909522022105225.webp'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 // image='/Parcetamol.jpg'
    //                 image='/product-photo-37909522022105225.webp'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>
    //         </div>
    //     </div>


    //     <div className='trending'>
    //         <div className='compo'>
    //             Shop By Category
    //         </div>

            
    //         <hr className='line_below'></hr>
    //         <div className='trending_medinces'>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 {/* <Card 
    //                 image='/Parcetamol.jpg'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 /> */}
    //                 <Category 
    //                     image={'/product-photo-37909522022105225.webp'}
    //                     content={"Personal Care Products"}
    //                 />

    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 {/* <Card 
    //                 image='/Parcetamol.jpg'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 /> */}
    //                 <Category 
    //                     image={'/istockphoto-526495161-612x612.jpg'}
    //                     content={"Baby Care Products"}
    //                 />
    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 {/* <Card 
    //                 image='/Parcetamol.jpg'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 /> */}
                    
    //                 <Category 
    //                     image={'/istockphoto-1386276499-612x612.jpg'}
    //                     content={"Home Medical Products"}
    //                 />
    //             </div>
    //         </div>
    //     </div>


    //     <div className='trending'>
    //         <div className='compo'>
    //             Shop By Health Condition
    //         </div>
    //         <hr className='line_below'></hr>
    //         <div className='trending_medinces'>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 image='/Parcetamol1.jpg'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 image='/Parcetamol1.jpg'
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>

    //             <div style={{margin: '1rem'}} className='item'>
    //                 <Card 
    //                 image='/Parcetamol1.jpg'
                    
    //                 price='&#8377;200' 
    //                 content='Parcetamol 500 Tablets'
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // </div>
  )
}

export default NormalHome
