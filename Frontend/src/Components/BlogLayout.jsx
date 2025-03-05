import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Blog/Header/Header';

function BlogLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="pt-16">
        <Outlet /> {/* This will render child routes */}
      </main>
    </div>
  );
}

export default BlogLayout;
