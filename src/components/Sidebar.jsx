import React from 'react';
import { GoFileDirectoryFill } from 'react-icons/go';
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { FaHouseUser, FaMoneyBillWave } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import { BsFileBreakFill } from 'react-icons/bs';

import { BsFillHouseAddFill } from 'react-icons/bs';
import { TbLogout2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { GiExpense } from 'react-icons/gi';

const Sidebar = ({ sideBarToggle, openSideBar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <aside id="sidebar" className={sideBarToggle ? 'sidebar-responsive' : ''}>
      <div className="sidebar-title">
        <div className="sidebar-brand w-100 d-flex align-items-center justify-content-center">
          <Link
            to="/dashboard"
            className="text-center"
            style={{ textDecoration: 'none', color: '#111827' }}
          >
            <img
              src={logo}
              className="icon-header"
              style={{ height: '200px', width: '160px' }}
            />
            <div style={{ fontWeight: 600, fontSize: '18px', marginTop: '10px' }}>
              Directory Management
            </div>
          </Link>
        </div>
        <span className="icon close-icon" onClick={openSideBar}>
          X
        </span>
      </div>
      <ul className="sidebar-list">
        <li
          className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard">
            <MdDashboard className="mx-2 pb-1" />
            Dashboard
          </Link>
        </li>

        <li
          className={`sidebar-item ${location.pathname === '/dashboard/residents' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard/residents">
            <FaHouseUser className="mx-2 pb-1" />
            Residents
          </Link>
        </li>

        <li
          className={`sidebar-item ${location.pathname === '/dashboard/newResident' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard/newResident">
            <BsFillHouseAddFill className="mx-2 pb-1" />
            Add Resident
          </Link>
        </li>
        <li
          className={`sidebar-item ${location.pathname === '/dashboard/expense' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard/expense">
            <FaMoneyBillWave className="mx-2 pb-1" />
            Finance
          </Link>
        </li>
        <li
          className={`sidebar-item ${location.pathname === '/dashboard/addAdmin' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard/addAdmin">
            <RiAdminFill className="mx-2 pb-1" />
            Add Admin
          </Link>
        </li>
        <li
          className={`sidebar-item ${location.pathname === '/dashboard/violations' ? 'active' : ''
            }`}
        >
          <Link to="/dashboard/violations">
            <BsFileBreakFill className="mx-2 pb-1" />
            Violations
          </Link>
        </li>

        <li
          className="sidebar-item mt-3"
          onClick={logout}
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            margin: '1rem',
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          <TbLogout2 className="mx-2 pb-1" />
          Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
