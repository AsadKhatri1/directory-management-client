import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";

const Dashboard = () => {
  const [sidebaropen, setSidebaropen] = useState(false);

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
