import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/DashboardLayout';
import Products from './pages/Products';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import CustomOrders from './pages/CustomOrders';
import Users from './pages/Users';
import Customers from './pages/Customers';
import Carts from './pages/Carts';
import Dashboard from './pages/Dashboard';
import OrdersReport from './pages/OrdersReport';
import Reviews from './pages/Reviews';

// Placeholder components for other routes
const Settings = () => <div><h2>Settings</h2></div>;

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="custom-orders" element={<CustomOrders />} />
          <Route path="orders-report" element={<OrdersReport />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
          <Route path="carts" element={<Carts />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
