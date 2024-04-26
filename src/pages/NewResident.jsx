import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import { toast } from "react-toastify";

const NewResident = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("token");
    if (auth) {
      setIsAuth(true);
    } else {
      toast.warn("Login to continue");
      navigate("/");
    }
  }, []);
  return (
    <div className="row">
      <div
        className="col-md-2 vh-100 border p-0"
        style={{ background: "#F5F5F5" }}
      >
        <AdminMenu />
      </div>
      <div className="col-md-10">h</div>
    </div>
  );
};

export default NewResident;
