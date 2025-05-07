import React, { useEffect, useState } from 'react';
// import OrderCard from '../components/OrderCard';
import OrderCard from '../Components/OrderCard';
import { useGetUserPastOrdersQuery } from '../app/addCartSlice';
import { useNavigate} from 'react-router-dom'
// const mockPastOrders = [
//   {
//     id: "ORD002",
//     date: "2024-03-15",
//     status: "Delivered",
//     items: [
//       {
//         name: "Smart Watch",
//         quantity: 1,
//         price: 199.99,
//         image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
//       }
//     ],
//     total: 199.99
//   }
// ];

function UserPastOrders() {

  const [currentOrders, setCurrentOrders] = useState([])
  const {data: userCurrentOrdersList, isError, error, isLoading } = useGetUserPastOrdersQuery(undefined, {refetchOnMountOrArgChange: true})
  const navigate = useNavigate()

  
  useEffect(() => {
    console.log(isError, error)
    if(userCurrentOrdersList) {
      console.log("this", userCurrentOrdersList.receivedItems)
      setCurrentOrders(userCurrentOrdersList.receivedItems)
      console.log("this is list", userCurrentOrdersList.receivedItems)
      
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
        <h1 className="text-2xl font-bold text-gray-800">Past Orders</h1>
        <p className="text-gray-600">View your order history</p>
      </div>
      <div className="space-y-4">
        {currentOrders && currentOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default UserPastOrders;