import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import moment from "moment";
import axios from "axios";

const ResidentDetail = () => {
  // redirect on refresh
  const [paid, setPaid] = useState(false);
  const params = useParams();
  const [resident, setResident] = useState([]);
  const [sidebaropen, setSidebaropen] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  const [tanents, setTanents] = useState([]);
  const [maids, setMaids] = useState([]);
  const [showM, setShowM] = useState(false);
  const [showV, setShowV] = useState(false);
  const [showS, setShowS] = useState(false);
  const [showT, setShowT] = useState(false);
  const navigate = useNavigate();

  // fetching single resident

  const getResident = async () => {
    try {
      const { data } = await axios.get(
        `https://directory-management-g8gf.onrender.com/api/v1/resident/getResident/${params.id}`
      );
      if (data.success) {
        setResident(data?.resident);
        setVehicle(data?.resident?.vehicles);
        setMembers(data?.resident?.relatives);
        setMaids(data?.resident?.maids);
        setTanents(data?.resident?.tanents);
      }
    } catch (err) {
      toast.error(err.response.message);
    }
  };
  useEffect(() => {
    getResident();
  }, []);

  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };

  const birthDate =
    resident.DOB && moment(resident?.DOB).format("MMMM Do, YYYY");

  const nocdate =
    resident.NOCIssue && moment(resident?.NOCIssue).format("MMMM Do, YYYY");

  // updating payment status

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://directory-management-g8gf.onrender.com/api/v1/resident/updateResident/${params.id}`,
        { paid: paid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include 'Bearer' prefix for most token types
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setPaid(false);
        navigate("/dashboard/residents");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.message);
    }
  };

  return (
    <div className="grid-container ">
      <Header openSideBar={sideBarToggle}></Header>
      <Sidebar
        sideBarToggle={sidebaropen}
        openSideBar={sideBarToggle}
      ></Sidebar>
      <div className="main-container mb-4">
        <div className="text-center">
          <h1 className="mb-5">RESIDENT DETAILS</h1>
          <div className="row my-1">
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{
                  backgroundColor: "#263043",
                  color: "white",
                  transition: "all 0.5s",
                }}
                onClick={(e) => {
                  setShowM(!showM),
                    setShowS(false),
                    setShowV(false),
                    setShowT(false);
                }}
              >
                {!showM ? "View Family Members" : "Hide Family Members"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={(e) => {
                  setShowS(!showS),
                    setShowM(false),
                    setShowV(false),
                    setShowT(false);
                }}
              >
                {!showS ? "View Servant Details" : "Hide Servant details"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={(e) => {
                  setShowV(!showV),
                    setShowM(false),
                    setShowS(false),
                    setShowT(false);
                }}
              >
                {!showV ? "View Vehicle Details" : "Hide Vehicle details"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={(e) => {
                  setShowT(!showT),
                    setShowM(false),
                    setShowS(false),
                    setShowV(false);
                }}
              >
                {!showT ? "View Tanent Details" : "Hide Tanent details"}
              </button>
            </div>
          </div>

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
                              <th scope="col">DOB</th>
                              <th scope="col">OCCUPATION</th>
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
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
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
                              <td>
                                {r.dob &&
                                  moment(r?.dob).format("MMMM Do, YYYY")}
                              </td>
                              <td>{r?.occupation}</td>
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
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
                              <td>{r?.name}</td>
                              <td>
                                {r.dob &&
                                  moment(r?.dob).format("MMMM Do, YYYY")}
                              </td>
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
              {showT ? (
                <div className="text-center">
                  <div className="my-5">
                    <h2 className=" my-5 text-secondary">TANENT DETAILS</h2>
                    <div className="table-responsive">
                      <table className="table table-dark table-bordered table-hover">
                        <thead className="bg-light">
                          {tanents.length > 0 ? (
                            <tr className="text-center">
                              <th scope="col">PHOTO</th>
                              <th scope="col">NAME</th>
                              <th scope="col">NOC NUMBER</th>
                              <th scope="col">NOC ISSUE DATE</th>
                              <th scope="col">MOBILE NUMBER</th>
                              <th scope="col">DOB</th>
                              <th scope="col">OCCUPATION</th>
                              <th scope="col">CNIC</th>
                            </tr>
                          ) : (
                            <span>
                              <h3 className="text-light">No Tanents To Show</h3>
                            </span>
                          )}
                        </thead>
                        <tbody>
                          {tanents.map((r, i) => (
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
                              <td>
                                {r.photoUrl ? (
                                  <img
                                    src={r?.photoUrl}
                                    alt="tanents photo"
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                ) : null}
                              </td>
                              <td>{r?.name}</td>
                              <td>{r?.nocNo}</td>
                              <td>
                                {r.nocIssue &&
                                  moment(r?.nocIssue).format("MMMM Do, YYYY")}
                              </td>
                              <td>{r?.number}</td>
                              <td>
                                {r.dob &&
                                  moment(r?.dob).format("MMMM Do, YYYY")}
                              </td>
                              <td>{r?.occupation}</td>
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

              <div className="mt-2 mb-5">
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
                    <h5>DOB : {birthDate}</h5>
                    <h5>CNIC # {resident?.CNIC}</h5>
                    <h5>NOC # {resident?.NOCNo}</h5>
                  </div>

                  <div className="col-md-6 ">
                    <h5>Profession : {resident?.Profession}</h5>
                    <h5>Qualification : {resident?.Qualification}</h5>
                    <h5>Business Address : {resident?.bAddress}</h5>
                    <h5>NOC Holder : {resident?.NOCHolder}</h5>
                    <h5>NOC Issue Date : {nocdate}</h5>
                  </div>
                </div>
              </div>

              {/* <div className="my-5"> */}

              {/* </div> */}
            </>
          )}
        </div>
        <form action="PUT" onSubmit={updateHandler}>
          <div className="form-check">
            {/* <input
              className="form-check-input "
              type="checkbox"
              id="flexCheckIndeterminate"
              onClick={(e) => {
                setPaid(true);
              }}
            /> */}
            <div className="form-check form-switch">
              <input
                className="form-check-input form-check-input-yes"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onClick={(e) => {
                  setPaid(true);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Payment Received?
              </label>
              <br />
              <input
                className="form-check-input form-check-input-no"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onClick={(e) => {
                  setPaid(false);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Payment Not Received?
              </label>
            </div>
            <button type="submit" className="btn btn-outline-success mt-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResidentDetail;
