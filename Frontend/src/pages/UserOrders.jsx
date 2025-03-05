import React, { useEffect, useState } from 'react';
import OrderCard from '../components/OrderCard';
import { useGetUserCurrentOrdersQuery } from '../app/addCartSlice';
import { useNavigate} from 'react-router-dom'


// const mockOrders = [
//   {
//     id: "ORD001",
//     date: "2024-03-20",
//     status: "In Transit",
//     items: [
//       {
//         name: "Wireless Headphones",
//         quantity: 1,
//         price: 99.99,
//         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
//       }
//     ],
//     total: 99.99
//   }
// ];

function UserOrders() {
  
  const [currentOrders, setCurrentOrders] = useState([])
  const {data: userCurrentOrdersList, isError, error, isLoading } = useGetUserCurrentOrdersQuery(undefined, {refetchOnMountOrArgChange: true})
  const navigate = useNavigate()

  useEffect(() => {
    console.log(isError, error)
    if(userCurrentOrdersList) {
      setCurrentOrders(userCurrentOrdersList.currentItems)
      console.log(userCurrentOrdersList.currentItems)
      console.log("this is list", userCurrentOrdersList.currentItems)
      
    }
  }, [userCurrentOrdersList])

  if(isLoading) {
    return <p>Loading...</p>
  }

    if (isError) {
      navigate('/')
      return <p>Error: {error.message || "Something went wrong"}</p>;
    }
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Current Orders</h1>
        <p className="text-gray-600">Track your ongoing orders</p>
      </div>
      <div className="space-y-4">
        {currentOrders && currentOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default UserOrders;