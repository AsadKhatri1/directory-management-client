import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import axios from "axios";
const ResidentDetail = () => {
  const params = useParams();
  const [resident, setResident] = useState([]);
  const [sidebaropen, setSidebaropen] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  const [timer, setTimer] = useState(0);
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

  // timer for loader
  useEffect(() => {
    const timerId = setTimeout(() => {
      setTimer(timer + 4);
    }, 4000);

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timerId);
  }, []);
  console.log(timer);
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

        <h5>Phone # {resident?.Phone}</h5>
        <h5>House # {resident?.HouseNumber}</h5>
        <h5>CNIC # {resident?.CNIC}</h5>
        <div className="text-center">
          <div className="my-5">
            <h2 className=" my-5 text-secondary">Family Members</h2>
            <div className="table-responsive">
              {members.length == 0 && timer < 4 ? (
                <div className="text-center d-flex align-items-center justify-content-center">
                  <Audio
                    height="80"
                    width="80"
                    radius="9"
                    color="rgba(255, 255, 255, 0.2)"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              ) : (
                <table className="table table-dark table-bordered table-hover">
                  <thead className="bg-light">
                    {members.length > 0 ? (
                      <tr className="text-center">
                        <th scope="col">NAME</th>
                        <th scope="col">RELATION</th>
                      </tr>
                    ) : (
                      <span>
                        <h3 className="text-info">No Family Members To Show</h3>
                      </span>
                    )}
                  </thead>
                  <tbody>
                    {members.map((r, i) => (
                      <tr key={r._id} className="text-center align-middle">
                        <td>{r?.name}</td>
                        <td>{r?.relation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className=" text-center">
          <h2 className="my-5 text-secondary">VEHICLE DETAILS</h2>
          <div className="table-responsive">
            {vehicle.length == 0 ? (
              <div className="text-center d-flex align-items-center justify-content-center">
                <Audio
                  height="80"
                  width="80"
                  radius="9"
                  color="rgba(255, 255, 255, 0.2)"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            ) : (
              <table className="table table-dark table-bordered table-hover">
                <thead className="bg-light">
                  {vehicle.length > 0 ? (
                    <tr className="text-center">
                      <th scope="col">TYPE</th>
                      <th scope="col">MAKE</th>
                      <th scope="col">MODEL</th>
                      <th scope="col">MODEL YEAR</th>
                      <th scope="col">REGISTERATION NUMBER</th>
                    </tr>
                  ) : (
                    <span>
                      <h3 className="text-info">No Vehicle Details To Show</h3>
                    </span>
                  )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetail;
