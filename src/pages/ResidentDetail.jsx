import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";

import axios from "axios";
const ResidentDetail = () => {
  // redirect on refresh

  const params = useParams();
  const [resident, setResident] = useState([]);
  const [sidebaropen, setSidebaropen] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  const [maids, setMaids] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showM, setShowM] = useState(false);
  const [showV, setShowV] = useState(false);
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
        setMaids(data?.resident?.maids);
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
      setTimer(timer + 3);
    }, 3000);

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timerId);
  }, []);
  const birthDate = new Date(resident?.DOB);
  const month = birthDate.getMonth();
  const date = birthDate.getDate();
  const year = birthDate.getFullYear();
  return (
    <div className="grid-container ">
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
        <h5>DOB : {date + "/" + month + "/" + year}</h5>
        <h5>CNIC # {resident?.CNIC}</h5>
        <h5>NOC # {resident?.NOCNo}</h5>
        <h5>Profession : {resident?.Profession}</h5>
        <h5>Qualification : {resident?.Qualification}</h5>

        {/* family members */}

        <div className="text-center">
          <div className="my-5">
            <h2 className=" my-5 text-secondary">Family Members</h2>
            <div className="table-responsive">
              {members.length == 0 && timer < 3 ? (
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
                        <th scope="col">MOBILE NUMBER</th>
                        <th scope="col">CNIC</th>
                      </tr>
                    ) : (
                      <span>
                        <h3 className="text-light">
                          No Family Members To Show
                        </h3>
                      </span>
                    )}
                  </thead>
                  <tbody>
                    {members.map((r, i) => (
                      <tr key={r._id} className="text-center align-middle">
                        <td>{r?.name}</td>
                        <td>{r?.relation}</td>
                        <td>{r?.number}</td>
                        <td>{r?.cnic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {/* maid details */}
        <div className="text-center">
          <div className="my-5">
            <h2 className=" my-5 text-secondary">
              Maids/Drivers/Gardeners Details
            </h2>
            <div className="table-responsive">
              {maids.length == 0 && timer < 3 ? (
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
                    {maids.length > 0 ? (
                      <tr className="text-center">
                        <th scope="col">NAME</th>
                        <th scope="col">DATE OF BIRTH</th>
                        <th scope="col">MOBILE NUMBER</th>
                        <th scope="col">CNIC</th>
                        <th scope="col">ADDRESS</th>
                        <th scope="col">GUARDIAN'S NAME</th>
                      </tr>
                    ) : (
                      <span>
                        <h3 className="text-light">No Maids Detail To Show</h3>
                      </span>
                    )}
                  </thead>
                  <tbody>
                    {maids.map((r, i) => (
                      <tr key={r._id} className="text-center align-middle">
                        <td>{r?.name}</td>
                        <td>{r?.dob}</td>
                        <td>{r?.number}</td>
                        <td>{r?.cnic}</td>
                        <td>{r?.address}</td>
                        <td>{r?.guardian}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* vehicle details */}
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
                      <th scope="col">COLOUR</th>
                      <th scope="col">REGISTERATION NUMBER</th>
                      <th scope="col">STICKER NUMBER</th>
                    </tr>
                  ) : (
                    <span>
                      <h3 className="text-light">No Vehicle Details To Show</h3>
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
                      <td>{r?.colour}</td>
                      <td>{r?.registrationNumber}</td>
                      <td>{r?.stickerNumber}</td>
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
