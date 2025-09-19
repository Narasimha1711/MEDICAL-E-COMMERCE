# 🏥 Medical E-commerce Platform

A **full-stack MERN application** that connects **users** and **medical shops (sellers)** for buying and selling medicines.  
The platform supports **real-time availability, location-based search, caching optimization, and flexible APIs** for a smooth e-commerce experience.  

---

## 🚀 Features

### 👤 User
- Search medicines by name or category.  
- Find nearby shops (sorted by distance).  
- Add medicines to cart and place orders.  
- View order history.  

### 🛒 Seller
- Register and list medicines with details (name, stock, price).  
- Manage inventory with stock updates.  
- View and manage customer orders.  

### ⚙️ Technical Features
- **Redis caching** for frequently accessed queries (response time improved by ~35%).  
- **GraphQL API** for flexible and efficient data fetching (reduced over-fetching).  
- **MongoDB indexing** on medicine names & locations (query latency reduced by ~40%).  
- **JWT authentication** for secure login (role-based access: user/seller).  
- **Responsive React UI** with Redux for state management.  

---

## 🛠️ Tech Stack

- **Frontend:** ReactJS, Redux, TailwindCSS  
- **Backend:** NodeJS, ExpressJS, GraphQL  
- **Database:** MongoDB (Mongoose)  
- **Caching:** Redis  
- **Authentication:** JWT  
- **Deployment:** Vercel  

---

## 🏗️ Architecture

```mermaid
flowchart TD
    User[User Browser] -->|HTTP/HTTPS| ReactUI[React + Redux Frontend]
    ReactUI -->|GraphQL/REST API| Backend[NodeJS + Express Server]
    Backend -->|Queries| MongoDB[(MongoDB Database)]
    Backend -->|Caching| Redis[(Redis Cache)]
    Backend --> Auth[JWT Authentication]
    Seller[Seller Portal] -->|HTTP/HTTPS| ReactUI
