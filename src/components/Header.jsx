import React from "react";
import { BsSearch, BsJustify } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Header = ({ openSideBar }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify
          className="icon"
          onClick={openSideBar}
          style={{ color: '#111827', cursor: 'pointer' }}
        />
      </div>
      <div className="header-right">
        <BsSearch
          className="icon"
          style={{ cursor: "pointer", color: '#03bb50' }}
          onClick={() => navigate("/dashboard/residents")}
        />
      </div>
    </header>
  );
};

export default Header;
