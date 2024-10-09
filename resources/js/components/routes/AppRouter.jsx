import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../../pages/Home";
import Employees from "../../admin/pages/users/Users";
import AddEmployee from "../../admin/pages/users/AddUser";
import Products from "../../admin/pages/products/Products";


const AppRouter = () => {


  const [loading, setLoading] = useState(true); // New state for loading spinner

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const _token = localStorage.getItem("_token");
  //       if (_token && !user) {
  //         let fetchedUser = await getUser(_token, true);
  //         dispatch(createUser({ user: fetchedUser }));
  //       }
  //     } catch (error) {
  //       console.error("Error validating token:", error);
  //     } finally {
  //       setLoading(false); // Stop loading after the user check is completed
  //     }
  //   })();
  // }, [navigate, user, dispatch]);

  // const loadingPage = async () => {
  //   const currentUrl = window.location.pathname;

  //   // Define guest routes
  //   const guestRoutes = ['/login', '/forget-password', '/reset-password','/create-password'];
  //   if (user && currentUrl == '/reset-password' || currentUrl == '/create-password' ) {
  //     localStorage.removeItem("_token");
  //     localStorage.removeItem("userType");
  //     }

  //   // Check if user is authenticated
  //   if (!user && !guestRoutes.includes(currentUrl)) {
  //     // Redirect to login if not authenticated and current page is not a guest route
  //     navigate('/login');
  //   } else if (user && guestRoutes.includes(currentUrl)) {
  //     // Redirect authenticated users based on their role if they are trying to access guest pages
  //     if (user.role === "admin") {
  //       navigate('/organizations');
  //     } else if (user.role === "manager") {
  //       navigate('/manager/dashboard');
  //     } else if (user.role === "looped_lead") {
  //       navigate('/loop-lead/dashboard');
  //     }
  //   }


  // };

  // useEffect(() => {
  //   loadingPage();
  // }, [navigate, user]);

  // if (loading) {
  //   // Display a loading spinner or message while loading
  //   return <Loading parentClas="page-loader d-flex justify-content-center align-items-center vh-100" />;
  // }

  return (
    <Routes>
      {
        Config.user.role === 'Admin' ?
          <>
            <Route path="/pages/" exact element={<Employees />} />
            <Route path="/pages/users" exact element={<Employees />} />
            <Route path="/pages/add-user" exact element={<AddEmployee />} />
            <Route path="/pages/add-user/:id" exact element={<AddEmployee />} />
            <Route path="/pages/products" exact element={<Products />} />
            <Route path="/pages/products/:id" exact element={<Products />} />
          </>
          :
          Config.user.status === 'Active' &&<>
            <Route path="/pages/" exact element={<Products />} />
            <Route path="/pages/products/:id" exact element={<Products />} />
          </>
      }
    </Routes>
  );
};

export default AppRouter;
