import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Expense = () => {
  const [sidebaropen, setSidebaropen] = useState(false);

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
