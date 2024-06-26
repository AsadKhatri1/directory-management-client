import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
const Header = ({ openSideBar }) => {
  const searchHandler = () => {};
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={openSideBar} />
      </div>
      {/* <div className="header-left d-flex flex-row align-items-center justify-content-center w-50 ">
        <form
          action="post"
          className="mx-2 rounded w-100  d-flex flex-row align-items-center justify-content-center"
        >
          <input type="text" className="w-100 input mx-2" />
          <BsSearch className="icon" onClick={searchHandler} />
        </form>
      </div> */}
      <div className="header-right">
        <BsSearch className="icon" style={{ cursor: "pointer" }} />
      </div>
    </header>
  );
};

export default Header;
