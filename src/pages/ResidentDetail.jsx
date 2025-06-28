import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { Audio } from "react-loader-spinner";
import moment from "moment";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
const ResidentDetail = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  // redirect on refresh
  const [paid, setPaid] = useState(false);
  const params = useParams();
  const [resident, setResident] = useState([]);
  const [monthsInput, setMonthsInput] = useState("");
  const [sidebaropen, setSidebaropen] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  const [tanents, setTanents] = useState([]);
  const [maids, setMaids] = useState([]);
  const [showM, setShowM] = useState(false);
  const [showV, setShowV] = useState(false);
  const [showS, setShowS] = useState(false);
  const [showT, setShowT] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [feeAmount, setFeeAmount] = useState("");
  const [Ownership, setOwnership] = useState("");
  const navigate = useNavigate();

  // modal work
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");


  // Add family member
  const [addMember, setAddMember] = useState(false);
   const [showFam, setShowFam] = useState(false);
const {id} = useParams();

 const [relatives, setRelatives] = useState([
    {
      name: "",
      relation: "",
      dob: "",
      occupation: "",
      cnic: "", // Existing CNIC property
      number: "",
      photoUrl: "", // New property for photo URL
      cnicUrl: "", // New property for CNIC URL (assuming it's an uploaded document)
    },
  ]);

  const handleRelativeChange = (index, name, event) => {
    const { value } = event.target;
    const updatedRelatives = [...relatives];
    updatedRelatives[index][name] = value;
    setRelatives(updatedRelatives);
  };

  
  // upload single files to cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  // uploading relative cnic and photo
  const handleRelativePhotoUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setRelatives((prevRelatives) => {
        const updatedRelatives = [...prevRelatives];
        updatedRelatives[index].photoUrl = uploadedUrl;
        return updatedRelatives;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };

  const handleRelativeCnicUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setRelatives((prevRelatives) => {
        const updatedRelatives = [...prevRelatives];
        updatedRelatives[index].cnicUrl = uploadedUrl;
        return updatedRelatives;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };

  const addRelativeField = async() => {
  // Add a new relative field
try {
  const response = await axios.post(
    `${backendURL}/api/v1/resident/${id}/family-members`,
    relatives[0] // assuming `relatives` is a single object representing one family member
  );
  console.log(response.data.message);

} catch (error) {
  console.error("Error adding relative field:", error);
  toast.error("Failed to add family member");
}

  };

  const deleteMember = (mid) => async () => {  
    try {     
      const response = await axios.delete(
        ` ${backendURL}/api/v1/resident/${id}/family-members/${mid}`,
      );
      console.log(response);
      
      if (response.data) {
        toast.success("Family member deleted successfully");
       setMembers((prevMembers) => prevMembers.filter((member) => member.id !== mid));
      } else {
        toast.error("Failed to delete family member");
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
      toast.error("Failed to delete family member");
    }
  }
  const [addVehicle, setAddVehicle] = useState(false);
  const [addMaid, setAddMaid] = useState(false);

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImageUrl("");
  };

  const renderImage = (url) => (
    <img
      src={url}
      alt="Document"
      style={{ width: "50px", height: "50px", cursor: "pointer" }}
      onClick={() => handleImageClick(url)}
    />
  );

  // fetching single resident

  const getResident = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/v1/resident/getResident/${params.id}`
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
      if (feeAmount) {
        // Ensure feeAmount is parsed as a number
        const feeAmountNumber = parseFloat(feeAmount);

        // Check if feeAmount is a valid number
        if (isNaN(feeAmountNumber)) {
          toast.error("Please enter a valid amount");
          return;
        }

        const resIn = await axios.post(
          `${backendURL}/api/v1/income/addIncome`,
          {
            ResidentName: resident.FullName ? resident.FullName : "Unknown",
            HouseNo: resident.HouseNumber,
            Amount: feeAmountNumber,
            Ownership: Ownership,
            Type: "membership",
          }
        );
        if (resIn.success) {
          toast.success("Income added");
        }

        const recAmount = feeAmountNumber / 2;
        const masjidAmount = feeAmountNumber / 2;

        // Update the balances
        const re1 = await axios.get(
          `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
        );
        const finalRecBalance = JSON.parse(re1.data.acc.Balance) + recAmount;
        await axios.put(
          `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
          {
            Balance: finalRecBalance,
          }
        );

        const re = await axios.get(
          `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
        );
        const finalMasjidBalance =
          JSON.parse(re.data.acc.Balance) + masjidAmount;
        await axios.put(
          `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
          {
            Balance: finalMasjidBalance,
          }
        );
      }

      // Get the number of months from the user input
      const numberOfMonths = parseInt(monthsInput); // Replace monthsInput with your actual input field

      // Perform the API call to update the resident's paid status
      const { data } = await axios.put(
        `${backendURL}/api/v1/resident/updateResident/${params.id}`,
        { paid, numberOfMonths },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include 'Bearer' prefix for most token types
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        console.log(data.resident);
        setPaid(false); // Assuming you want to reset this state after successful update
        navigate("/dashboard/residents");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.message || "An error occurred");
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
              {showM && members[0].name.length > 0 ? (
                <div className="text-center">
                  <div className="my-5">
                    <h2 className="my-5 text-secondary">Family Members</h2>
                    <div className="table-responsive">
                      <table className="table table-dark table-bordered table-hover">
                        <thead className="bg-light">
                          <tr className="text-center">
                            <th scope="col">PHOTO</th>
                            <th scope="col">NAME</th>
                            <th scope="col">RELATION</th>
                            <th scope="col">MOBILE NUMBER</th>
                            <th scope="col">DOB</th>
                            <th scope="col">OCCUPATION</th>
                            <th scope="col">CNIC Number</th>
                            <th scope="col">CNIC</th>
                            <th scope="col">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((r) => (
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
                              <td>
                                {r.photoUrl ? renderImage(r.photoUrl) : null}
                              </td>
                              <td>{r.name}</td>
                              <td>{r.relation}</td>
                              <td>{r.number}</td>
                              <td>
                                {r.dob && moment(r.dob).format("MMMM Do, YYYY")}
                              </td>
                              <td>{r.occupation}</td>
                              <td>{r.cnic}</td>
                              <td>
                                {r.cnicUrl ? renderImage(r.cnicUrl) : null}
                              </td>
                              <button className="text-center btn btn-outline-primary m-1 " onClick={deleteMember(r._id)}>delete</button>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="btn btn-outline-secondary mb-3" onClick={()=>{setAddMember(true) , setShowM(false)}}>
                        Add Family Member
                      </button>
                    </div>
                  </div>
                </div>
              ) : showM ? (
                <div
                  className="text-center py-3 pt-4"
                  style={{ backgroundColor: "#263043", borderRadius: "12px" }}
                >
                  <h3 className="text-light">No Family Members To Show</h3>
                </div>
              ) : null}
              {
                addMember && (<>
          
   {/* family members starts here */}
        {addMember && (
          <div className="row">
            <hr />
            <h1 className="my-3 fw-bold text-center">Enter Family Members</h1>
            {relatives.map((relative, index) => (
              <>
                <div className="col-md-6">
                  <div key={index}>
                    <input
                      value={relative.name}
                      onChange={(e) => handleRelativeChange(index, "name", e)}
                      type="text"
                      name="name"
                      placeholder="Faily Member Name"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <select
                      value={relative.relation}
                      onChange={(e) =>
                        handleRelativeChange(index, "relation", e)
                      }
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <option
                        value=""
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Select Relation
                      </option>
                      <option
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                        value="Father"
                      >
                        Father
                      </option>
                      <option
                        value="Mother"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Mother
                      </option>
                      <option
                        value="Husband/Wife"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Husband/Wife
                      </option>
                      <option
                        value="Child"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Child
                      </option>
                      {/* Add other relation options */}
                    </select>
                    <input
                      value={relative.cnic}
                      onChange={(e) => handleRelativeChange(index, "cnic", e)}
                      type="text"
                      name="cnic"
                      placeholder="CNIC"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={relative.occupation}
                      onChange={(e) =>
                        handleRelativeChange(index, "occupation", e)
                      }
                      type="text"
                      name="occupation"
                      placeholder="Occupation"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <input
                      value={relative.number}
                      onChange={(e) => handleRelativeChange(index, "number", e)}
                      type="tel"
                      name="number"
                      placeholder="Phone No"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <label htmlFor="date">Date Of Birth</label>
                    <br />
                    <input
                      value={relative.dob}
                      onChange={(e) => handleRelativeChange(index, "dob", e)}
                      type="date"
                      name="dob"
                      placeholder="Date Of Birth"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {relative.photoUrl
                        ? relative.photoUrl.name
                        : "Upload Photo"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/*"
                        onChange={(event) =>
                          handleRelativePhotoUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {relative.cnicUrl ? relative.cnicUrl.name : "Upload CNIC"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/* "
                        onChange={(event) =>
                          handleRelativeCnicUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </>
            ))}
            <div className="w-100 text-center">
              <button
                type="button"
                onClick={addRelativeField}
                className="btn btn-outline-primary m-5 mt-2 w-25 "
              >
                <FaPlus /> Members
              </button>
            </div>
          </div>
        )}
                </>)
              }

              {/* maid details */}
              <br />
              {showS && maids[0].name.length > 0 ? (
                <div className="text-center">
                  <div className="my-5">
                    <h2 className="my-5 text-secondary">Servant Details</h2>
                    <div className="table-responsive">
                      <table className="table table-dark table-bordered table-hover">
                        <thead className="bg-light">
                          <tr className="text-center">
                            <th scope="col">NAME</th>
                            <th scope="col">DATE OF BIRTH</th>
                            <th scope="col">MOBILE NUMBER</th>
                            <th scope="col">CNIC</th>
                            <th scope="col">ADDRESS</th>
                            <th scope="col">GUARDIAN'S NAME</th>
                            <th scope="col">CNIC</th>
                            <th scope="col">CANT PASS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maids.map((r) => (
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
                              <td>{r.name}</td>
                              <td>
                                {r.dob && moment(r.dob).format("MMMM Do, YYYY")}
                              </td>
                              <td>{r.number}</td>
                              <td>{r.cnic}</td>
                              <td>{r.address}</td>
                              <td>{r.guardian}</td>
                              <td>
                                {r.cnicUrl ? renderImage(r.cnicUrl) : null}
                              </td>
                              <td>
                                {r.cantPassUrl
                                  ? renderImage(r.cantPassUrl)
                                  : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : showS ? (
                <div
                  className="text-center py-3 pt-4"
                  style={{ backgroundColor: "#263043", borderRadius: "12px" }}
                >
                  <h3 className="text-light">No Servant Details To Show</h3>
                </div>
              ) : null}

              {/* vehicle details */}
              {showV && vehicle[0].make.length > 0 ? (
                <div className="text-center">
                  <h2 className="my-5 text-secondary">Vehicle Details</h2>
                  <div className="table-responsive">
                    <table className="table table-dark table-bordered table-hover">
                      <thead className="bg-light">
                        <tr className="text-center">
                          <th scope="col">TYPE</th>
                          <th scope="col">MAKE</th>
                          <th scope="col">MODEL</th>
                          <th scope="col">MODEL YEAR</th>
                          <th scope="col">COLOUR</th>
                          <th scope="col">REGISTRATION NUMBER</th>
                          <th scope="col">STICKER NUMBER</th>
                          <th scope="col">DOCUMENT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicle.map((r) => (
                          <tr key={r._id} className="text-center align-middle">
                            <td>{r.type}</td>
                            <td>{r.make}</td>
                            <td>{r.model}</td>
                            <td>{r.year}</td>
                            <td>{r.colour}</td>
                            <td>{r.registrationNumber}</td>
                            <td>{r.stickerNumber}</td>
                            <td>
                              {r.paperDocument
                                ? renderImage(r.paperDocument)
                                : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : showV ? (
                <div
                  className="text-center py-3 pt-4"
                  style={{ backgroundColor: "#263043", borderRadius: "12px" }}
                >
                  <h3 className="text-light">No Vehicle Details To Show</h3>
                </div>
              ) : null}

              

              {/* Modal */}
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <img
                    src={selectedImageUrl}
                    alt="Document"
                    style={{ width: "100%" }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* <div className="mt-2 mb-5">
                <img
                  src={resident?.Photo}
                  alt="image"
                  style={{
                    borderRadius: "100%",
                    height: "200px",
                    width: "200px",
                  }}
                />
                <h1 className="my-3">{resident?.FullName}</h1>

                <div
                  className="row my-3 py-3 mx-3"
                  style={{
                    backgroundColor: "#263043",
                    borderRadius: "12px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  }}
                >
                  <div className="col-md-6">
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
              </div> */}

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
                <h1 className="my-3">{resident?.FullName}</h1>
                <div
                  className="row my-4 py-4 mx-3"
                  style={{
                    backgroundColor: "#2A354A",
                    borderRadius: "16px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.15) 0px 8px 16px, rgba(0, 0, 0, 0.1) 0px 4px 8px",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.01)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="col-md-6 px-4">
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>Email:</span>{" "}
                        {resident?.Email || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>Phone #:</span>{" "}
                        {resident?.Phone || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>House #:</span>{" "}
                        {resident?.HouseNumber || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>DOB:</span>{" "}
                        {birthDate || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>CNIC #:</span>{" "}
                        {resident?.CNIC || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>NOC #:</span>{" "}
                        {resident?.NOCNo || "N/A"}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-6 px-4">
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>Profession:</span>{" "}
                        {resident?.Profession || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>Qualification:</span>{" "}
                        {resident?.Qualification || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>
                          Business Address:
                        </span>{" "}
                        {resident?.bAddress || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>NOC Holder:</span>{" "}
                        {resident?.NOCHolder || "N/A"}
                      </h5>
                    </div>
                    <div className="mb-3">
                      <h5
                        className="text-light"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        <span style={{ color: "#A0AEC0" }}>
                          NOC Issue Date:
                        </span>{" "}
                        {nocdate || "N/A"}
                      </h5>
                    </div>
                  </div>
                </div>
                {/* New Section for Uploaded Files */}

                <div
                  className="my-4 py-4 mx-3 px-4"
                  style={{
                    backgroundColor: "#2A354A",
                    borderRadius: "16px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.15) 0px 8px 16px, rgba(0, 0, 0, 0.1) 0px 4px 8px",
                  }}
                >
                  <h2
                    className="text-center text-secondary mb-4"
                    style={{ fontSize: "1.8rem", fontWeight: "600" }}
                  >
                    Uploaded Files
                  </h2>
                  <div className="row justify-content-center g-3">
                    {resident?.CnicFile && (
                      <div className="col-md-4 col-sm-6 text-center">
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: "#33415C",
                            borderRadius: "12px",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <h5
                            className="text-light mb-3"
                            style={{ fontSize: "1.2rem" }}
                          >
                            CNIC
                          </h5>
                          <img
                            src={resident.CnicFile}
                            alt="CNIC Document"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #ffffff33",
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                            }}
                            onClick={() => handleImageClick(resident.CnicFile)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff66")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff33")
                            }
                          />
                        </div>
                      </div>
                    )}
                    {resident?.NocFile && (
                      <div className="col-md-4 col-sm-6 text-center">
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: "#33415C",
                            borderRadius: "12px",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <h5
                            className="text-light mb-3"
                            style={{ fontSize: "1.2rem" }}
                          >
                            NOC
                          </h5>
                          <img
                            src={resident.NocFile}
                            alt="NOC Document"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #ffffff33",
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                            }}
                            onClick={() => handleImageClick(resident.NocFile)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff66")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff33")
                            }
                          />
                        </div>
                      </div>
                    )}
                    {resident?.CantFile && (
                      <div className="col-md-4 col-sm-6 text-center">
                        <div
                          className="p-3"
                          style={{
                            backgroundColor: "#33415C",
                            borderRadius: "12px",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <h5
                            className="text-light mb-3"
                            style={{ fontSize: "1.2rem" }}
                          >
                            Cant Pass
                          </h5>
                          <img
                            src={resident.CantFile}
                            alt="Cant Pass Document"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #ffffff33",
                              cursor: "pointer",
                              transition: "border-color 0.2s",
                            }}
                            onClick={() => handleImageClick(resident.CantFile)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff66")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.borderColor = "#ffffff33")
                            }
                          />
                        </div>
                      </div>
                    )}
                    {!resident?.CnicFile &&
                      !resident?.NocFile &&
                      !resident?.CantFile && (
                        <div className="text-center py-3">
                          <h5
                            className="text-light"
                            style={{
                              fontSize: "1.3rem",
                              backgroundColor: "#33415C",
                              borderRadius: "8px",
                              padding: "15px",
                              display: "inline-block",
                            }}
                          >
                            No Uploaded Files Available
                          </h5>
                        </div>
                      )}
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
            <div className="form-check form-switch">
              <input
                className="form-check-input form-check-input-yes"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                onClick={(e) => {
                  setPaid(true);
                  setShowAmountInput(true);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Payment Received?
              </label>
              <br />
              {showAmountInput ? (
                <>
                  <input
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    type="number"
                    name="Fee Amount"
                    id="FeeAmount"
                    placeholder="Received Amount"
                    className="w-50 my-3 text-white py-2"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid white",
                      borderRadius: "12px",
                      textIndent: "12px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    }}
                  />{" "}
                  <br />
                  <input
                    value={monthsInput}
                    onChange={(e) => setMonthsInput(e.target.value)}
                    type="number"
                    name="Number"
                    id="FeeAmount"
                    placeholder="Number of Months"
                    className="w-50 my-3 text-white py-2"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid white",
                      borderRadius: "12px",
                      textIndent: "12px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    }}
                  />
                  <div className="form-group">
                    <select
                      className="w-50 my-3 text-white py-2"
                      id="account"
                      value={Ownership}
                      onChange={(e) => setOwnership(e.target.value)}
                      required
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <option
                        value=""
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          color: "black",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Ownership
                      </option>
                      <option
                        value="owner"
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          color: "black",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Owner
                      </option>
                      <option
                        value="tanent"
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          color: "black",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Tanent
                      </option>
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
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
