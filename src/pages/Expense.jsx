import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Expense = () => {
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
      <ExpenseForm />
    </div>
  );
};

export default Expense;
