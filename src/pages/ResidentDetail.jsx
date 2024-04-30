import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const ResidentDetail = () => {
  const params = useParams();
  const [resident, setResident] = useState([]);
  const [sidebaropen, setSidebaropen] = useState(false);
  // fetching single resident

  const getResident = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/resident/getResident/${params.id}`
      );
      if (data.success) {
        setResident(data?.resident);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  useEffect(() => {
    getResident();
  }, []);

  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };
  console.log(resident);
  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle}></Header>
      <Sidebar
        sideBarToggle={sidebaropen}
        openSideBar={sideBarToggle}
      ></Sidebar>
      <div className="main-container text-center">
        <h1 className="mb-5">RESIDENT DETAIL</h1>
        <div className="my-5">
          <h1>{resident.FullName}</h1>
          <h6>{resident.Email}</h6>
        </div>

        <h3>Phone # {resident.Phone}</h3>
        <h3>House # {resident.HouseNumber}</h3>
        <h3>CNIC # {resident.CNIC}</h3>
      </div>
    </div>
  );
};

export default ResidentDetail;
