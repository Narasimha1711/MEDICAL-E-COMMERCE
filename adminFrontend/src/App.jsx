import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Sellers from './pages/Sellers';
import Products from './pages/Products';
import { useStore } from './data/store';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const {
    users, sellers, products, stats,
    addUser, updateUser, deleteUser,
    addSeller, updateSeller, deleteSeller,
    addProduct, updateProduct, deleteProduct
  } = useStore();

  console.log('App.jsx rendering:', { activePage, stats, users, sellers, products });

  const renderContent = () => {
    console.log('Rendering content for activePage:', activePage);
    try {
      switch (activePage) {
        case 'dashboard':
          return <Dashboard stats={stats || {}} />;
        case 'users':
          return (
            users ? (
              <Users 
                users={users} 
                onAdd={addUser} 
                onUpdate={updateUser} 
                onDelete={deleteUser} 
              />
            ) : (
              <div className="p-6 bg-white">No user data available</div>
            )
          );
        case 'sellers':
          return (
            sellers ? (
              <Sellers 
                sellers={sellers} 
                onAdd={addSeller} 
                onUpdate={updateSeller} 
                onDelete={deleteSeller} 
              />
            ) : (
              <div className="p-6 bg-white">No seller data available</div>
            )
          );
        case 'products':
          return (
            products && sellers ? (
              <Products 
                products={products} 
                sellers={sellers}
                onAdd={addProduct} 
                onUpdate={updateProduct} 
                onDelete={deleteProduct} 
              />
            ) : (
              <div className="p-6 bg-white">No product or seller data available</div>
            )
          );
        default:
          return <Dashboard stats={stats || {}} />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return <div className="p-6 bg-white">Error rendering {activePage}: {error.message}</div>;
    }
  };

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      {renderContent()}
    </Layout>
  );
}

export default App;