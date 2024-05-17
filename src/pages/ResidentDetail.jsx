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
  const [showM, setShowM] = useState(false);
  const [showV, setShowV] = useState(false);
  const [showS, setShowS] = useState(false);

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
        <h1 className="mb-5">RESIDENT DETAILS</h1>
        {resident.length < 1 ? (
          <div className=" d-flex align-items-center justify-content-center">
            <Audio
              height="80"
              width="100"
              radius="9"
              color="rgba(255, 255, 255, 0.2)"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          </div>
        ) : (
          <>
            <div className="my-5">
              <img
                src={resident?.Photo}
                alt="image"
                style={{
                  borderRadius: "100%",
                  height: "200px",
                  width: "200px",
                }}
              />
              <h1>{resident?.FullName}</h1>
              <div className="row border my-3 py-3">
                <div className="col-md-6  ">
                  <h5>EMAIL : {resident?.Email}</h5>
                  <h5>Phone # {resident?.Phone}</h5>
                  <h5>House # {resident?.HouseNumber}</h5>
                  <h5>DOB : {date + "/" + month + "/" + year}</h5>
                  <h5>CNIC # {resident?.CNIC}</h5>
                  <h5>NOC # {resident?.NOCNo}</h5>
                </div>

                <div className="col-md-6 ">
                  <h5>Profession : {resident?.Profession}</h5>
                  <h5>Qualification : {resident?.Qualification}</h5>
                  <h5>Business Address : {resident?.bAddress}</h5>
                  <h5>NOC Holder : {resident?.NOCHolder}</h5>
                  <h5>NOC Issue Date : {resident?.NOCIssue}</h5>
                </div>
              </div>
            </div>

            <div className="row my-1">
              <div className="col-md-4">
                <button
                  className="btn mt-2 mb-2 border"
                  style={{
                    backgroundColor: "#263043",
                    color: "white",
                    transition: "all 0.5s",
                  }}
                  onClick={(e) => {
                    setShowM(!showM), setShowS(false), setShowV(false);
                  }}
                >
                  {!showM ? "View Family Members" : "Hide Family Members"}
                </button>
              </div>
              <div className="col-md-4">
                <button
                  className="btn mt-2 mb-2 border"
                  style={{ backgroundColor: "#263043", color: "white" }}
                  onClick={(e) => {
                    setShowS(!showS), setShowM(false), setShowV(false);
                  }}
                >
                  {!showS ? "View Servant Details" : "Hide Servant details"}
                </button>
              </div>
              <div className="col-md-4">
                <button
                  className="btn mt-2 mb-2 border"
                  style={{ backgroundColor: "#263043", color: "white" }}
                  onClick={(e) => {
                    setShowV(!showV), setShowM(false), setShowS(false);
                  }}
                >
                  {!showV ? "View Vehicle Details" : "Hide Vehicle details"}
                </button>
              </div>
            </div>
            {/* family members */}

            <br />
            {showM ? (
              <div className="text-center">
                <div className="my-5">
                  <h2 className=" my-5 text-secondary">Family Members</h2>
                  <div className="table-responsive">
                    <table className="table table-dark table-bordered table-hover">
                      <thead className="bg-light">
                        {members.length > 0 ? (
                          <tr className="text-center">
                            <th scope="col">PHOTO</th>
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
                            <td>
                              {r.photoUrl ? (
                                <img
                                  src={r?.photoUrl}
                                  alt="Member photo"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              ) : null}
                            </td>
                            <td>{r?.name}</td>
                            <td>{r?.relation}</td>
                            <td>{r?.number}</td>
                            <td>{r?.cnic}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* maid details */}

            <br />
            {showS ? (
              <div className="text-center">
                <div className="my-5">
                  <h2 className=" my-5 text-secondary">Servant Details</h2>
                  <div className="table-responsive">
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
                            <th scope="col">CNIC</th>
                          </tr>
                        ) : (
                          <span>
                            <h3 className="text-light">
                              No Servant Details To Show
                            </h3>
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
                            <td>
                              {r?.cnicUrl ? (
                                <img
                                  src={r?.cnicUrl}
                                  alt="Document"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* vehicle details */}

            {showV ? (
              <div className=" text-center">
                <h2 className="my-5 text-secondary">VEHICLE DETAILS</h2>
                <div className="table-responsive">
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
                          <th scope="col">DOCUMENT</th>
                        </tr>
                      ) : (
                        <span>
                          <h3 className="text-light">
                            No Vehicle Details To Show
                          </h3>
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
                          <td>
                            {r?.paperDocument ? (
                              <img
                                src={r?.paperDocument}
                                alt="Document"
                                style={{ width: "50px", height: "50px" }}
                              />
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResidentDetail;
