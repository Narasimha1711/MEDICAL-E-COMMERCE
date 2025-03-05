/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import SellerSidebar from "../Components/SellerSidebar.jsx";
import { SellerContextData } from "../SellerContext.jsx";
import "./SellerAddMedicine.css";

// Toast Component
const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all transform translate-y-0 
        ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <span className="text-xl">&times;</span>
      </button>
    </div>
  );
};

// Main Component
const SellerAddMedicine = () => {
  const [file, setFile] = useState(null);
  const [medicineName, setMedicineName] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tablets");
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [toast, setToast] = useState(null);

  const { sellerData, setSellerData } = useContext(SellerContextData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get("/seller-info");
        setSellerData(response.data);
        localStorage.setItem("SellerDetails", JSON.stringify(response.data));
      } catch (err) {
        console.error(err);
        if (err.response?.data?.path === "/login") {
          setToast({ message: "Please login first", type: "error" });
          setTimeout(() => navigate("/sellerLogin"), 2000);
        }
      }
    };
    fetchSellerDetails();
  }, []);

  

  useEffect(() => {
    if (price && discount) {
      const discountValue = (parseFloat(price) * parseFloat(discount)) / 100;
      const calculatedDiscountedPrice = parseFloat(price) - discountValue;
      setDiscountedPrice(calculatedDiscountedPrice.toFixed(2)); // Round to 2 decimal places
    } else {
      setDiscountedPrice("");
    }
  }, [price, discount]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setToast({
            message: "Location fetched successfully",
            type: "success",
          });
        },
        (error) =>
          setToast({
            message: `Error fetching location: ${error.message}`,
            type: "error",
          })
      );
    } else {
      setToast({
        message: "Geolocation is not supported by this browser",
        type: "error",
      });
    }
  };

  const checkExistingMedicine = async (medicineName, price) => {
    try {
      const response = await axios.get(
        `/checkMedicine?medicineName=${medicineName}&price=${price}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking for existing medicine", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const medicineExists = await checkExistingMedicine(medicineName, price);
      if (medicineExists) {
        setToast({
          message: "Medicine with the same name and price already exists",
          type: "error",
        });
        return;
      }

      const formData = new FormData();
      formData.append("medicineName", medicineName);
      formData.append("price", price);
      formData.append("count", count);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("discount", discount);
      formData.append("discountedPrice", discountedPrice);
      formData.append("location", JSON.stringify(location));
      formData.append("image", file);

      await axios.post("/addMedicine", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ message: "Medicine added successfully", type: "success" });

      // Reset form after successful submission
      setMedicineName("");
      setFile(null);
      setPrice("");
      setCount("");
      setDescription("");
      setCategory("tablets");
      setDiscount("");
      setDiscountedPrice("");
      setLocation({ lat: "", lon: "" });

      setTimeout(() => navigate("/sellerInventory"), 2000);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Error adding medicine",
        type: "error",
      });
      if (err.response?.data?.path === "/login") {
        setTimeout(() => navigate("/sellerLogin"), 2000);
      }
    }
  };

  return (
    <div className="new-dashboard">
      <div className="new-dashboard__container">
        <div className="new">
          <SellerSidebar />
          <div className="newContainer">
            <div className="top">
              <h1>Add Your Medicine</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="Selected"
                />
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlinedIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      required
                    />
                  </div>
                  <div className="formInput">
                    <label>Medicine Name</label>
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="formInput">
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Cost"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="formInput">
                    <label>Discount Percentage</label>
                    <input
                      type="number"
                      placeholder="Discount (%)"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                  <div className="formInput">
                    <label>Discounted Price</label>
                    <input
                      type="text"
                      value={
                        discountedPrice
                          ? parseFloat(discountedPrice).toFixed(2)
                          : ""
                      }
                      readOnly
                      placeholder="Calculated Discounted Price"
                    />
                  </div>

                  <div className="formInput">
                    <label>Count of the Medicine</label>
                    <input
                      type="number"
                      placeholder="Count"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="formInput">
                    <label>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="tablets">Tablets</option>
                      <option value="syrup">Syrup</option>
                      <option value="capsules">Capsules</option>
                    </select>
                  </div>
                  <div className="formInput">
                    <label>Description of Medicine</label>
                    <textarea
                      rows="5"
                      placeholder="Description of the Medicine"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="formInput">
                    <label>Location</label>
                    <button type="button" onClick={handleLocationFetch}>
                      Fetch Location
                    </button>
                    <input
                      type="text"
                      value={`Lat: ${location.lat}, Lon: ${location.lon}`}
                      readOnly
                    />
                  </div>
                  <button type="submit">Add Medicine</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SellerAddMedicine;
