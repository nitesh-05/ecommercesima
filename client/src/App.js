
import {Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage'
import './App.css';
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pagenotfound from "./pages/Pagenotfound";
import Policy from "./pages/Policy";
import Resister from "./pages/Auth/Resister";

// import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routs/Private";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routs/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateProduct from "./pages/Admin/CreateProduct";
import CreateCategory from "./pages/Admin/CreateCategory";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Order";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import PasswordReset from "./pages/Auth/PasswordReset";
import AdminResister from "./pages/Admin/AdminResister";






function App() {
  return (
    <>
    <Routes>
      <Route path='/' element= {<HomePage/>}/>
      <Route path="/product/:slug" element={<ProductDetails/>} />
      <Route path="/categories" element={<Categories/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/category/:slug" element={<CategoryProduct/>} />
   
      <Route path='/search' element= {<Search/>}/>
      <Route path='/resister' element= {<Resister/>}/>
      <Route path='/admin-resister' element= {<AdminResister/>}/>
      <Route path='/passwordreset' element= {<PasswordReset/>}/>
      <Route path="/forgot-password/:id/:token" element={<ForgotPasssword/>} />
      <Route path='/login' element= {<Login/>}/>
     
      <Route path="/dashboard" element={<PrivateRoute/>}>
          <Route path="user" element={<Dashboard/>} />
          <Route path="user/orders" element={<Orders/>} />
          <Route path="user/profile" element={<Profile/>} />
      </Route>
      <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard/>} />
          <Route path="admin/create-category" element={<CreateCategory/>} />
          <Route path="admin/create-product" element={<CreateProduct/>} />
          <Route path="admin/product/:slug" element={<UpdateProduct/>} />
          <Route path="admin/products" element={<Products/>} />
          <Route path="admin/users" element={<Users/>} />
          <Route path="admin/orders" element={<AdminOrders/>} />
      </Route>
      <Route path='/about' element= {<About/>}/>
      <Route path='/contact' element= {<Contact/>}/>
      <Route path='/policy' element= {<Policy/>}/>
      <Route path='/*' element= {<Pagenotfound/>}/>
    </Routes>
    </>
  );
}

export default App;
