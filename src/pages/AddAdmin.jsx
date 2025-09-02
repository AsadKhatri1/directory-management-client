import { useState } from "react";

// import AdminMenu from "../components/AdminMenu";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import AdminForm from "../components/AdminForm";

const AddAdmin = () => {
  const [sidebaropen, setSidebaropen] = useState(false);

  // function for toggling sidebar
  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };
  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle} />
      <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />
      <AdminForm />
    </div>
  );
};

export default AddAdmin;
