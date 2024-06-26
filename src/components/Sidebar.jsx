import React from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaHouseUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { BsFillHouseAddFill } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { GiExpense } from "react-icons/gi";
const Sidebar = ({ sideBarToggle, openSideBar }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Loggedout successfully");
    navigate("/");
  };
  return (
    <aside id="sidebar" className={sideBarToggle ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "#9e9ea4" }}
          >
            <img
              src={logo}
              className="icon-header"
              style={{ height: "150px", width: "120px" }}
            />{" "}
            Directory Management
          </Link>
        </div>
        <span className="icon close-icon" onClick={openSideBar}>
          X
        </span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/dashboard">
            <MdDashboard className="mx-2" />
            Dashboard
          </Link>
        </li>

        <li className="sidebar-item">
          {" "}
          <Link to="/dashboard/residents">
            <FaHouseUser className="mx-2" />
            Residents
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/dashboard/newResident">
            <BsFillHouseAddFill className="mx-2" /> Add Resident
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/dashboard/addAdmin">
            <RiAdminFill className="mx-2" />
            Add Admin
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/dashboard/expense">
            <GiExpense className="mx-2" />
            Add Expense
          </Link>
        </li>
        <li className="sidebar-item bg-danger text-white" onClick={logout}>
          {" "}
          <TbLogout2 className="mx-2" />
          Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
