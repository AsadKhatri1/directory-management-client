import React from "react";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminMenu = () => {
  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();

    localStorage.removeItem("token");
    toast.success("Loggedout successfully");
    navigate("/");
  };

  return (
    <div className="mb-5 d-flex flex-column justify-content-between">
      <div className="links">
        <ul className="list-group">
          <NavLink
            to="/dashboard"
            className="product_link mb-2 rounded-end "
            style={{ textDecoration: "none" }}
          >
            <li
              className="list-group-item fw-bold py-3 fs-5"
              style={{
                background: "#3C5B6F",
                textDecoration: "none",
                color: "white",
              }}
            >
              Home
            </li>
          </NavLink>
          <NavLink
            to="/dashboard/residents"
            className="product_link my-2 rounded-end"
            style={{ textDecoration: "none" }}
          >
            <li
              className="list-group-item fw-bold py-3 fs-5 "
              style={{
                background: "#3C5B6F",
                textDecoration: "none",
                color: "white",
              }}
            >
              Residents
            </li>
          </NavLink>
          <NavLink
            to="/dashboard/newResident"
            className="product_link my-2 rounded-end"
            style={{ textDecoration: "none" }}
          >
            <li
              className="list-group-item  fw-bold py-3 fs-5"
              style={{
                background: "#3C5B6F",
                textDecoration: "none",
                color: "white",
              }}
            >
              New Resident
            </li>
          </NavLink>
          <NavLink
            to="/dashboard/addAdmin"
            className="product_link my-2 mb-5"
            style={{ textDecoration: "none" }}
          >
            <li
              className="list-group-item  fw-bold py-3 fs-5 rounded-end"
              style={{
                background: "#3C5B6F",
                textDecoration: "none",
                color: "white",
              }}
            >
              Add Admin
            </li>
          </NavLink>
        </ul>
      </div>
      <div className="log m-5">
        <button
          className="btn btn-danger w-100 mt-5 text-center "
          onClick={logout}
        >
          <RiLogoutBoxLine className="fs-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminMenu;
