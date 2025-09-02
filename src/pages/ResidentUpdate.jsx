import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResidentUpdateForm from "../components/ResidentUpdateForm";

const ResidentUpdate = () => {
  const [sidebaropen, setSidebaropen] = useState(false);
  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };
  return (
    <div>
      <div className="grid-container">
        <Header openSideBar={sideBarToggle} />
        <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />
        <ResidentUpdateForm />
      </div>
    </div>
  );
};

export default ResidentUpdate;
