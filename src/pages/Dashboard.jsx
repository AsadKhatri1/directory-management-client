import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import AdminMenu from "../components/AdminMenu";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";

const Dashboard = () => {
  const [sidebaropen, setSidebaropen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth) {
      setIsAuth(true);
    } else {
      toast.warn("Login to continue");
      navigate("/");
    }
  }, []);

  // function for toggling sidebar
  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };
  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle} />
      <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />
      <Home />
    </div>
  );
};

export default Dashboard;
