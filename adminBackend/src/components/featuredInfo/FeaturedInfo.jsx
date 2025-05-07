import { useEffect, useState } from "react";
import "./featuredInfo.css";
import axios from "axios";

export default function FeaturedInfo() {
  const [data1, setData1] = useState(null); // For users
  const [data2, setData2] = useState(null); // For sellers
  const [data3, setData3] = useState(null); // For medicines
  const [data4, setData4] = useState(null); // For revenue
  const [data5, setData5] = useState(null); // For out of stock products
  const [data6, setData6] = useState(null); // For total orders
  const [data7, setData7] = useState(null); // For total orders1
  const [data8, setData8] = useState(null); // For total orders2
  const [data9, setData9] = useState(null); // For total orders3



  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setData1(response.data.length1); // Assuming the API returns length1
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  // fetch number of orders
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/order");
        setData6(response.data.totalOrders); // Assuming the API returns length1
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // fetch out of order
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/medicines");
        console.log(response);
        setData5(response.data.lowStockCount); // Assuming the API returns length1
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // fetch revenue
  useEffect(() => {
    const revenueFetch = async () => {
      try {
        const response = await axios.get("/api/orders");
        setData4(response.data.totalRevenue); // Assuming the API returns length1
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    revenueFetch();
  }, []);


  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get("/api/sellers");
        setData2(response.data.length2); // Accessing length2 from the response
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("/api/medicine ");
        setData3(response.data.length3); // Accessing length3 from the response
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data1 !== null ? data1 : "Loading..."}
          </span>
        </div>
        <span className="featuredSub">Total users</span>
      </div>
      

      <div className="featuredItem">
        <span className="featuredTitle">Sellers</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data2 !== null ? data2 : "Loading..."}
          </span>{" "}
          {/* Displaying sellers count */}
        </div>
        <span className="featuredSub">Total sellers</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Medicines</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data3 !== null ? data3 : "Loading..."}
          </span>{" "}
          {/* Displaying medicines count */}
        </div>
        <span className="featuredSub">Total medicines</span>
      </div>


      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data4 !== null ? data4 : "Loading..."}
          </span>{" "}
          {/* Displaying medicines count */}
        </div>
        <span className="featuredSub">Total revenue generated</span>
      </div>



      <div className="featuredItem">
        <span className="featuredTitle">Out of stock </span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data5 !== null ? data5 : "Loading..."}
          </span>{" "}
          {/* Displaying medicines count */}
        </div>
        <span className="featuredSub">Total prod to be stocked </span>
      </div>


      <div className="featuredItem">
        <span className="featuredTitle">Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {data6 !== null ? data6 : "Loading..."}
          </span>{" "}
          {/* Displaying medicines count */}
        </div>
        <span className="featuredSub">Total orders dispatched</span>
      </div>      


     
 

     

      

      




    </div>
  );
}
