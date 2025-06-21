import { useState } from "react";

// import AdminMenu from "../components/AdminMenu";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import ResidentForm from "../components/ResidentForm";

const NewResident = () => {
  const [sidebaropen, setSidebaropen] = useState(false);

  // function for toggling sidebar
  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };
  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle} />
      <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />
      <ResidentForm />
    </div>
  );
};

export default NewResident;
