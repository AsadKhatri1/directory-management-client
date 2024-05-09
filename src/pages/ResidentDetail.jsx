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
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  // fetching single resident

  const getResident = async () => {
    try {
      const { data } = await axios.get(
        `https://directory-management.onrender.com/api/v1/resident/getResident/${params.id}`
      );
      if (data.success) {
        setResident(data?.resident);
        setVehicle(data?.resident?.vehicles);
        setMembers(data?.resident?.relatives);
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
  console.log(vehicle);
  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle}></Header>
      <Sidebar
        sideBarToggle={sidebaropen}
        openSideBar={sideBarToggle}
      ></Sidebar>
      <div className="main-container text-center mb-4">
        <h1 className="mb-5">RESIDENT DETAIL</h1>
        <div className="my-5">
          <h1>{resident?.FullName}</h1>
          <h6>{resident?.Email}</h6>
        </div>
        <div className="fam">
          <h3>Family Members</h3>
          {members.map((m, i) => (
            <>
              <h5>{m.name}</h5>
              <h5>{m.relation}</h5>
            </>
          ))}
        </div>

        <h5>Phone # {resident?.Phone}</h5>
        <h5>House # {resident?.HouseNumber}</h5>
        <h5>CNIC # {resident?.CNIC}</h5>
        <div className=" text-center">
          <h2 className="my-5 text-secondary">VEHICLE DETAILS</h2>
          <div className="table-responsive">
            {vehicle.length == 0 ? (
              <h3 className="text-center text-info">
                No vehicle details to show
              </h3>
            ) : (
              <table className="table table-dark table-bordered table-hover">
                <thead className="bg-light">
                  <tr className="text-center">
                    <th scope="col">TYPE</th>
                    <th scope="col">MAKE</th>
                    <th scope="col">MODEL</th>
                    <th scope="col">MODEL YEAR</th>
                    <th scope="col">REGISTERATION NUMBER</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.map((r, i) => (
                    <tr key={r._id} className="text-center align-middle">
                      <td>{r?.type}</td>
                      <td>{r?.make}</td>
                      <td>{r?.model}</td>
                      <td>{r?.year}</td>
                      <td>{r?.registrationNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* <table className="table table-dark table-bordered table-hover">
              <thead className="bg-light">
                <tr className="text-center">
                  <th scope="col">TYPE</th>
                  <th scope="col">MAKE</th>
                  <th scope="col">MODEL</th>
                  <th scope="col">MODEL YEAR</th>
                  <th scope="col">REGISTERATION NUMBER</th>
                </tr>
              </thead>
              <tbody>
               
                {vehicle.map((r, i) => (
                  <tr key={r._id} className="text-center align-middle">
                    <td>{r.type}</td>
                    <td>{r.make}</td>
                    <td>{r.model}</td>
                    <td>{r.year}</td>
                    <td>{r.registrationNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetail;
