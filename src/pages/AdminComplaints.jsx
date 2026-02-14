import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ComplaintTable from "../components/ComplaintTable";

const AdminComplaints = () => {
    const [sidebaropen, setSidebaropen] = useState(false);

    const sideBarToggle = () => {
        setSidebaropen(!sidebaropen);
    };

    return (
        <div className="grid-container">
            <Header openSideBar={sideBarToggle} />
            <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />
            <ComplaintTable />
        </div>
    );
};

export default AdminComplaints;
