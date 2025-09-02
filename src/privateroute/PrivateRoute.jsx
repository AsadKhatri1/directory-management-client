import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
     toast.error("Login First...");
    navigate("/");

    }
  }, [navigate, token]);

  return (
    <>
     
      {children}
       <ToastContainer />
    </>
  );
};

export default PrivateRoute;
