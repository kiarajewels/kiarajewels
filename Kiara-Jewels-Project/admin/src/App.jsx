import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Customers from './pages/Customers';
import Carts from './pages/Carts';
import Dashboard from './pages/Dashboard';
import OrdersReport from './pages/OrdersReport';

// Placeholder components for other routes
const Settings = () => <div><h2>Settings</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders-report" element={<OrdersReport />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
          <Route path="carts" element={<Carts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
