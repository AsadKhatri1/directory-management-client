import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { Audio } from "react-loader-spinner";
import moment from "moment";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const ResidentDetail = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  const [paid, setPaid] = useState(false);
  const params = useParams();
  const [resident, setResident] = useState([]);
  const [monthsInput, setMonthsInput] = useState("");
  const [sidebaropen, setSidebaropen] = useState(false);
  const [vehicle, setVehicle] = useState([]);
  const [members, setMembers] = useState([]);
  const [tanents, setTanents] = useState([]);
  const [showM, setShowM] = useState(false);
  const [showV, setShowV] = useState(false);
  const [showS, setShowS] = useState(false);
  const [showT, setShowT] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [feeAmount, setFeeAmount] = useState("");
  const [Ownership, setOwnership] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [addMember, setAddMember] = useState(false);
  const { id } = useParams();
  const [showTanents, setShowTanents] = useState(false);
  const [showView, setShowView] = useState(true);

  const [relatives, setRelatives] = useState([
    {
      name: "",
      relation: "",
      dob: "",
      occupation: "",
      cnic: "",
      number: "",
      photoUrl: "",
      cnicUrl: "",
    },
  ]);

  const handleRelativeChange = (index, name, event) => {
    const { value } = event.target;
    const updatedRelatives = [...relatives];
    updatedRelatives[index][name] = value;
    setRelatives(updatedRelatives);
  };

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
      { method: "POST", body: formData }
    );
    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  const handleRelativePhotoUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadFileToCloudinary(file);
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
    if (!file) return;
    try {
      const uploadedUrl = await uploadFileToCloudinary(file);
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

  const addRelativeField = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/v1/resident/${id}/family-members`,
        relatives[relatives.length - 1],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        toast.success("Family member added successfully");
        setRelatives([
          {
            name: "",
            relation: "",
            dob: "",
            occupation: "",
            cnic: "",
            number: "",
            photoUrl: "",
            cnicUrl: "",
          },
        ]);
        setAddMember(false);
        setShowM(true);
        await getResident();
      } else {
        toast.error(response.data.message || "Failed to add family member");
      }
    } catch (error) {
      console.error("Error adding relative field:", error);
      toast.error(
        error.response?.data?.message || "Failed to add family member"
      );
    }
  };

  const deleteMember = (mid) => async () => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/v1/resident/${id}/family-members/${mid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        toast.success("Family member deleted successfully");
        await getResident();
      } else {
        toast.error("Failed to delete family member");
      }
    } catch (error) {
      console.error("Error deleting family member:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete family member"
      );
    }
  };
  const [ownerResident, setOwnerResident] = useState([
    {
      FullName: "",
      Email: "",
      CNIC: "",
      HouseNumber: "",
      NOCHolder: "",
      Phone: "",
      Profession: "",
    },
  ]);
  const [maids, setMaids] = useState([
    {
      name: "",
      dob: "",
      address: "",
      guardian: "",
      number: "",
      cnic: "",
      cnicUrl: "",
      cantPassUrl: "",
    },
  ]);

  const [showServant, setShowServant] = useState(false);
  const [maid, setMaid] = useState([
    {
      name: "",
      dob: "",
      address: "",
      guardian: "",
      number: "",
      cnic: "",
      cnicUrl: "",
      cantPassUrl: "",
    },
  ]);

  const handleMaidChange = (name, value) => {
    setMaid((prevMaid) => ({
      ...prevMaid,
      [name]: value,
    }));
  };

  const handleMaidCnicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadFileToCloudinary(file);
      setMaid((prev) => ({
        ...prev,
        cnicUrl: uploadedUrl,
      }));
    } catch (error) {
      console.error("Error uploading CNIC:", error);
      alert("Error uploading CNIC. Please try again.");
    }
  };

  const handleMaidCantPassUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadFileToCloudinary(file);
      setMaid((prev) => ({
        ...prev,
        cantPassUrl: uploadedUrl,
      }));
    } catch (error) {
      console.error("Error uploading Cant Pass:", error);
      alert("Error uploading Cant Pass. Please try again.");
    }
  };

  const addMaidField = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/v1/resident/${id}/maids`,
        maid,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        toast.success("Servant added successfully");

        // Reset only if needed
        setMaid({
          name: "",
          dob: "",
          address: "",
          guardian: "",
          number: "",
          cnic: "",
          cnicUrl: "",
          cantPassUrl: "",
        });
        getResident();
        setShowS(true);
        setShowServant(false);
      } else {
        toast.error("Failed to add Servant member");
      }
    } catch (error) {
      console.error("Error adding Servant field:", error);
      toast.error(
        error.response?.data?.message || "Failed to add Servant member"
      );
    }
  };

  const deleteServant = (sid) => async () => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/v1/resident/${id}/maids/${sid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        toast.success("Servant deleted successfully");
        getResident();
      } else {
        toast.error("Failed to delete Servant member");
      }
    } catch (error) {
      console.error("Error deleting Servant member:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete Servant member"
      );
    }
  };

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

  const getResident = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/v1/resident/getResident/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        setResident(data?.resident || {});
        setVehicle(data?.resident?.vehicles || []);
        setMembers(data?.resident?.relatives || []);
        setMaids(data?.resident?.maids || []);
        setTanents(data?.resident?.tanents || []);
      } else {
        toast.error(data.message || "Failed to fetch resident data");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error fetching resident data"
      );
    }
  };
  // Vehicle
  const [showVehicle, setShowVehicle] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      type: "",
      make: "",
      model: "",
      year: "",
      colour: "",
      stickerNumber: "",
      registrationNumber: "",
      paperDocument: "",
    },
  ]);

  // uploading car papers to cloudinary
  const handlePaperDocumentUpload = async (event, index) => {
    const file = event.target.files[0];

    if (!file) {
      return; // No file selected, do nothing
    }

    try {
      let uploadedUrl;

      // Upload image to Cloudinary if it's an image (optional):

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update vehicle array with uploaded URL
      setVehicles((prevVehicles) => {
        const updatedVehicles = [...prevVehicles];
        updatedVehicles[index].paperDocument = uploadedUrl;
        return updatedVehicles;
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error uploading document. Please try again.");
    }
  };

  const handleVehicleChange = (index, event) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][event.target.name] = event.target.value;
    setVehicles(updatedVehicles);
  };

  const addVehicleField = async () => {
    try {
      const vehicleToAdd = vehicles[0];
      const response = await axios.post(
        `${backendURL}/api/v1/resident/${id}/vehicles`,
        vehicleToAdd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response) {
        toast.success("Vehicle added successfully");
        setVehicles({
          type: "",
          make: "",
          model: "",
          year: "",
          colour: "",
          stickerNumber: "",
          registrationNumber: "",
          paperDocument: "",
        });
        getResident();
        setShowV(true);
        setShowVehicle(false);
      } else {
        toast.error("Failed to add Vehicle member");
      }
    } catch (error) {
      console.error("Error adding Vehicle field:", error);
      toast.error(
        error.response?.data?.message || "Failed to add Vehicle member"
      );
    }
  };

  const deleteVehicle = async (vid) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/v1/resident/${id}/vehicles/${vid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        toast.success("Vehicle Deleted Successfully");
        getResident();
      } else {
        toast.error("Failed to delete Vehicle");
      }
    } catch (error) {
      console.error("Error deleting Vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to delete Vehicle");
    }
  };

  useEffect(() => {
    getResident();
  }, [resident]);

  const sideBarToggle = () => {
    setSidebaropen(!sidebaropen);
  };

  const birthDate =
    resident.DOB && moment(resident?.DOB).format("MMMM Do, YYYY");
  const nocdate =
    resident.NOCIssue && moment(resident?.NOCIssue).format("MMMM Do, YYYY");

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      if (feeAmount) {
        const feeAmountNumber = parseFloat(feeAmount);
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
        const re1 = await axios.get(
          `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
        );
        const finalRecBalance = JSON.parse(re1.data.acc.Balance) + recAmount;
        await axios.put(
          `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
          { Balance: finalRecBalance }
        );
        const re = await axios.get(
          `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
        );
        const finalMasjidBalance =
          JSON.parse(re.data.acc.Balance) + masjidAmount;
        await axios.put(
          `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
          { Balance: finalMasjidBalance }
        );
      }
      const numberOfMonths = parseInt(monthsInput);
      const { data } = await axios.put(
        `${backendURL}/api/v1/resident/updateResident/${params.id}`,
        { paid, numberOfMonths },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      toast.error(err.response?.message || "An error occurred");
    }
  };

  // console.log(resident);
  console.log(
    `${backendURL}/api/v1/resident/getResident/${resident.HouseNumber}/${resident.residentType}`
  );

  const getTanentOwner = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/v1/resident/getResident/${resident.HouseNumber}/${resident.residentType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOwnerResident(response.data.residents);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (resident.HouseNumber && resident.residentType) {
      getTanentOwner();
    }
  }, [resident.HouseNumber, resident.residentType, resident._id]);

  console.log(ownerResident);

  return (
    <div className="grid-container">
      <Header openSideBar={sideBarToggle}></Header>
      <Sidebar
        sideBarToggle={sidebaropen}
        openSideBar={sideBarToggle}
      ></Sidebar>
      <div className="main-container mb-4">
        <div className="text-center">
          <h1 className="mb-5">RESIDENT DETAILS</h1>
          <div className="row my-1">
            <div className="col-md-3 ">
              <button
                className="btn mt-2 mb-2 border"
                style={{
                  backgroundColor: "#263043",
                  color: "white",
                  transition: "all 0.5s",
                }}
                onClick={() => {
                  setShowM(!showM);
                  setShowS(false);
                  setShowV(false);
                  setShowT(false);
                  setShowServant(false);
                  setShowVehicle(false);
                }}
              >
                {!showM ? "View Family Members" : "Hide Family Members"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={() => {
                  setShowS(!showS);
                  setShowM(false);
                  setShowV(false);
                  setShowT(false);
                  // setOwnerResident(false);
                  setAddMember(false);
                  setShowVehicle(false);
                }}
              >
                {!showS ? "View Servant Details" : "Hide Servant details"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={() => {
                  setShowV(!showV);
                  setShowM(false);
                  setShowVehicle(false);
                  setShowS(false);
                  setShowT(false);
                  setAddMember(false);
                  setShowServant(false);
                }}
              >
                {!showV ? "View Vehicle Details" : "Hide Vehicle details"}
              </button>
            </div>
            <div className="col-md-3">
              <button
                className="btn mt-2 mb-2 border"
                style={{ backgroundColor: "#263043", color: "white" }}
                onClick={() => {
                  setShowTanents(!showTanents);
                  setShowV(false);
                  setShowM(false);
                  setShowVehicle(false);
                  setShowS(false);
                  setShowT(false);
                  setAddMember(false);
                  setShowServant(false);
                  setShowVehicle(false);
                }}
              >
                {!showTanents
                  ? `View ${
                      resident.residentType === "owner" ? "Tenants" : "Owner"
                    } Details`
                  : `Hide ${
                      resident.residentType === "owner" ? "Tenants" : "Owner"
                    } details`}
              </button>
            </div>
          </div>
          {resident.length < 1 ? (
            <div className="d-flex align-items-center justify-content-center">
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
              {showM && members.length > 0 ? (
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
                                {r.photoUrl ? renderImage(r.photoUrl) : "N/A"}
                              </td>
                              <td>{r.name || "N/A"}</td>
                              <td>{r.relation || "N/A"}</td>
                              <td>{r.number || "N/A"}</td>
                              <td>
                                {r.dob
                                  ? moment(r.dob).format("MMMM Do, YYYY")
                                  : "N/A"}
                              </td>
                              <td>{r.occupation || "N/A"}</td>
                              <td>{r.cnic || "N/A"}</td>
                              <td>
                                {r.cnicUrl ? renderImage(r.cnicUrl) : "N/A"}
                              </td>
                              <td>
                                <button
                                  className="text-center btn btn-outline-primary m-1"
                                  onClick={deleteMember(r._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => {
                          setAddMember(true);
                          setShowM(false);
                        }}
                      >
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
                  <button
                    className="btn btn-outline-success m-5 mt-2 w-25"
                    onClick={() => {
                      setAddMember(true);
                      setShowM(false);
                    }}
                  >
                    Add Family Member
                  </button>
                </div>
              ) : null}

              {resident.residentType === "owner" &&
                showTanents &&
                tanents.length > 0 && (
                  <div className="text-center">
                    <div className="my-5">
                      <h2 className="my-5 text-secondary">Tanents Details</h2>
                      <div className="table-responsive">
                        <table className="table table-dark table-bordered table-hover">
                          <thead className="bg-light">
                            <tr className="text-center">
                              <th scope="col">NAME</th>
                              <th scope="col">EMAIL</th>
                              <th scope="col">CNIC</th>
                              <th scope="col">House Number</th>
                              <th scope="col">NOC HOLDER</th>
                              <th scope="col">OCCUPATION</th>
                              <th scope="col">MOBILE NUMBER</th>
                              <th scope="col">CNIC</th>
                              <th scope="col">Photo</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerResident?.map((t) => (
                              <tr
                                key={t._id}
                                className="text-center align-middle"
                              >
                                <td>{t?.FullName || "N/A"}</td>
                                <td>{t.Email || "N/A"}</td>
                                <td>{t.CNIC || "N/A"}</td>
                                <td>{t.HouseNumber || "N/A"}</td>
                                <td>{t.NOCHolder || "N/A"}</td>
                                <td>{t.Profession || "N/A"}</td>
                                <td>{t.Phone || "N/A"}</td>
                                <td>
                                  {t.CnicFile ? renderImage(t.CnicFile) : "N/A"}
                                </td>
                                <td>
                                  {t.Photo ? renderImage(t.Photo) : "N/A"}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-outline-primary m-1"
                                    onClick={() => {
                                      setShowTanents(false);
                                      navigate(`/dashboard/resident/${t._id}`);
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              {resident.residentType === "tenant" && showTanents && (
                <div className="text-center">
                  <div className="my-5">
                    <h2 className="my-5 text-secondary">Owner Details</h2>
                    <div className="table-responsive">
                      <table className="table table-dark table-bordered table-hover">
                        <thead className="bg-light">
                          <tr className="text-center">
                            <th scope="col">NAME</th>
                            <th scope="col">EMAIL</th>
                            <th scope="col">CNIC</th>
                            <th scope="col">House Number</th>
                            <th scope="col">NOC HOLDER</th>
                            <th scope="col">OCCUPATION</th>
                            <th scope="col">MOBILE NUMBER</th>
                            <th scope="col">CNIC</th>
                            <th scope="col">Photo</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ownerResident.map((t) => (
                            <tr
                              key={t._id}
                              className="text-center align-middle"
                            >
                              <td>{t?.FullName || "N/A"}</td>
                              <td>{t.Email || "N/A"}</td>
                              <td>{t.CNIC || "N/A"}</td>
                              <td>{t.HouseNumber || "N/A"}</td>
                              <td>{t.NOCHolder || "N/A"}</td>
                              <td>{t.Profession || "N/A"}</td>
                              <td>{t.Phone || "N/A"}</td>
                              <td>
                                {t.CnicFile ? renderImage(t.CnicFile) : "N/A"}
                              </td>
                              <td>{t.Photo ? renderImage(t.Photo) : "N/A"}</td>
                              <td>
                                <button
                                  className="btn btn-outline-primary m-1"
                                  onClick={() => {
                                    setShowTanents(false);
                                    navigate(`/dashboard/resident/${t._id}`);
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {addMember && (
                <div className="row">
                  <hr />
                  <h1 className="my-3 fw-bold text-center">
                    Enter Family Members
                  </h1>
                  {relatives.map((relative, index) => (
                    <React.Fragment key={index}>
                      <div className="col-md-6">
                        <div>
                          <input
                            value={relative.name}
                            onChange={(e) =>
                              handleRelativeChange(index, "name", e)
                            }
                            type="text"
                            name="name"
                            placeholder="Family Member Name"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          >
                            <option value="" style={{ background: "black" }}>
                              Select Relation
                            </option>
                            <option
                              value="Father"
                              style={{ background: "black" }}
                            >
                              Father
                            </option>
                            <option
                              value="Mother"
                              style={{ background: "black" }}
                            >
                              Mother
                            </option>
                            <option
                              value="Husband/Wife"
                              style={{ background: "black" }}
                            >
                              Husband/Wife
                            </option>
                            <option
                              value="Child"
                              style={{ background: "black" }}
                            >
                              Child
                            </option>
                          </select>
                          <input
                            value={relative.cnic}
                            onChange={(e) =>
                              handleRelativeChange(index, "cnic", e)
                            }
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <input
                            value={relative.number}
                            onChange={(e) =>
                              handleRelativeChange(index, "number", e)
                            }
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                          <label htmlFor="date">Date Of Birth</label>
                          <input
                            value={relative.dob}
                            onChange={(e) =>
                              handleRelativeChange(index, "dob", e)
                            }
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          >
                            {relative.cnicUrl
                              ? relative.cnicUrl.name
                              : "Upload CNIC"}
                            <input
                              type="file"
                              name="nocFile"
                              accept="image/*"
                              onChange={(event) =>
                                handleRelativeCnicUpload(index, event)
                              }
                              hidden
                            />
                          </label>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  <div className="w-100 text-center">
                    <button
                      type="button"
                      onClick={addRelativeField}
                      className="btn btn-outline-success m-5 mt-2 w-25"
                    >
                      Submit Member
                    </button>
                  </div>
                </div>
              )}

              {showS && maids.length > 0 ? (
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
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maids.map((r) => (
                            <tr
                              key={r._id}
                              className="text-center align-middle"
                            >
                              <td>{r.name || "N/A"}</td>
                              <td>
                                {r.dob
                                  ? moment(r.dob).format("MMMM Do, YYYY")
                                  : "N/A"}
                              </td>
                              <td>{r.number || "N/A"}</td>
                              <td>{r.cnic || "N/A"}</td>
                              <td>{r.address || "N/A"}</td>
                              <td>{r.guardian || "N/A"}</td>
                              <td>
                                {r.cnicUrl ? renderImage(r.cnicUrl) : "N/A"}
                              </td>
                              <td>
                                {r.cantPassUrl
                                  ? renderImage(r.cantPassUrl)
                                  : "N/A"}
                              </td>
                              <td>
                                <button
                                  className="text-center btn btn-outline-primary m-1"
                                  onClick={deleteServant(r._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      className="btn btn-outline-success m-5 mt-2 w-25"
                      onClick={() => {
                        setShowServant(true);
                        setShowS(false);
                      }}
                    >
                      Add Servant
                    </button>
                  </div>
                </div>
              ) : showS ? (
                <div
                  className="text-center py-3 pt-4"
                  style={{ backgroundColor: "#263043", borderRadius: "12px" }}
                >
                  <h3 className="text-light">No Servant Details To Show</h3>
                  <button
                    className="btn btn-outline-success m-5 mt-2 w-25"
                    onClick={() => {
                      setShowServant(true);
                      setShowS(false);
                    }}
                  >
                    Add Servant
                  </button>
                </div>
              ) : null}

              {/* servant details */}

              {showServant && (
                <div className="row">
                  <hr />
                  <h1 className="my-3 fw-bold text-center">
                    Enter servant details
                  </h1>
                  <div className="col-md-6">
                    <input
                      value={maid.name}
                      onChange={(e) => handleMaidChange("name", e.target.value)}
                      type="text"
                      name="name"
                      className="w-75 my-3 text-white py-2"
                      placeholder="Servant's Name"
                      style={inputStyle}
                    />
                    <br />
                    <input
                      value={maid.dob}
                      onChange={(e) => handleMaidChange("dob", e.target.value)}
                      type="date"
                      name="dob"
                      placeholder="Date Of Birth"
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    />
                    <br />
                    <input
                      value={maid.address}
                      onChange={(e) =>
                        handleMaidChange("address", e.target.value)
                      }
                      type="text"
                      name="address"
                      placeholder="Address"
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    />
                    <br />
                    <input
                      value={maid.guardian}
                      onChange={(e) =>
                        handleMaidChange("guardian", e.target.value)
                      }
                      type="text"
                      name="guardian"
                      placeholder="Guardian's Name"
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    />
                    <br />
                  </div>
                  <div className="col-md-6">
                    <input
                      value={maid.number}
                      onChange={(e) =>
                        handleMaidChange("number", e.target.value)
                      }
                      type="tel"
                      name="number"
                      placeholder="Phone Number"
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    />
                    <br />
                    <input
                      value={maid.cnic}
                      onChange={(e) => handleMaidChange("cnic", e.target.value)}
                      type="text"
                      name="cnic"
                      placeholder="CNIC Number"
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    />
                    <br />

                    <label
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    >
                      {maid.cnicUrl ? "CNIC Uploaded" : "Upload CNIC"}
                      <input
                        type="file"
                        name="cnicFile"
                        accept="image/*"
                        onChange={handleMaidCnicUpload}
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={inputStyle}
                    >
                      {maid.cantPassUrl
                        ? "Cant Pass Uploaded"
                        : "Upload Cant Pass"}
                      <input
                        type="file"
                        name="cantPassFile"
                        accept="image/*"
                        onChange={handleMaidCantPassUpload}
                        hidden
                      />
                    </label>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      className="btn btn-success m-5 mt-2 w-25 pt-2"
                      onClick={() => {
                        addMaidField();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {showV && vehicle.length > 0 ? (
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
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicle.map((r) => (
                          <tr key={r._id} className="text-center align-middle">
                            <td>{r.type || "N/A"}</td>
                            <td>{r.make || "N/A"}</td>
                            <td>{r.model || "N/A"}</td>
                            <td>{r.year || "N/A"}</td>
                            <td>{r.colour || "N/A"}</td>
                            <td>{r.registrationNumber || "N/A"}</td>
                            <td>{r.stickerNumber || "N/A"}</td>
                            <td>
                              {r.paperDocument
                                ? renderImage(r.paperDocument)
                                : "N/A"}
                            </td>
                            <td>
                              <button
                                className="text-center btn btn-outline-primary m-1"
                                onClick={() => {
                                  deleteVehicle(r._id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-outline-secondary mb-3"
                      onClick={() => {
                        setShowVehicle(true);
                        setShowV(false);
                      }}
                    >
                      Add Vehicle
                    </button>
                  </div>
                </div>
              ) : showV ? (
                <div
                  className="text-center py-3 pt-4"
                  style={{ backgroundColor: "#263043", borderRadius: "12px" }}
                >
                  <h3 className="text-light">No Vehicle Details To Show</h3>
                  <button
                    className="btn btn-outline-success m-5 mt-2 w-25"
                    onClick={() => {
                      setShowVehicle(true);
                      setShowV(false);
                    }}
                  >
                    Add Vehicle
                  </button>
                </div>
              ) : null}

              {/* vehicle details */}

              {/* vehicle details */}
              {showVehicle && (
                <div className="row text-center">
                  <hr />
                  <h1 className="my-3 fw-bold">Enter vehicle details</h1>
                  {vehicles?.map((vehicle, index) => (
                    <>
                      <div className="col-md-6">
                        <div key={index}>
                          {/* selection */}

                          <input
                            value={vehicle.type}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="type"
                            placeholder="Vehicle Type | Car or Motorcycle"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                          <input
                            value={vehicle.colour}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="colour"
                            placeholder="Colour"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />

                          <input
                            value={vehicle.make}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="make"
                            placeholder="Vehicle Make"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                          <input
                            value={vehicle.model}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="model"
                            placeholder="Vehicle Model Name"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <input
                            value={vehicle.year}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="year"
                            placeholder="Vehicle Year"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                          <input
                            value={vehicle.stickerNumber}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="stickerNumber"
                            placeholder="Sticker Number"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          />
                          <input
                            value={vehicle.registrationNumber}
                            onChange={(e) => handleVehicleChange(index, e)}
                            type="text"
                            name="registrationNumber"
                            placeholder="Vehicle Registration Number"
                            className="w-75 my-3 text-white py-2"
                            style={{
                              background: "transparent",
                              border: "none",
                              borderBottom: "1px solid white",
                              borderRadius: "12px",
                              textIndent: "12px",
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                            }}
                          >
                            {vehicle.paperDocument
                              ? vehicle.paperDocument.name
                              : "Upload Document"}
                            <input
                              type="file"
                              name="nocFile"
                              accept="image/*"
                              onChange={(event) =>
                                handlePaperDocumentUpload(event, index)
                              }
                              hidden
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={addVehicleField}
                      className="btn btn-outline-primary w-25 m-5 mt-2"
                    >
                      Submit Vehicle
                    </button>
                  </div>
                </div>
              )}

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

              {showView && (
                <>
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
                            <span style={{ color: "#A0AEC0" }}>
                              Profession:
                            </span>{" "}
                            {resident?.Profession || "N/A"}
                          </h5>
                        </div>
                        <div className="mb-3">
                          <h5
                            className="text-light"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            <span style={{ color: "#A0AEC0" }}>
                              Qualification:
                            </span>{" "}
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
                            <span style={{ color: "#A0AEC0" }}>
                              NOC Holder:
                            </span>{" "}
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
                                (e.currentTarget.style.transform =
                                  "scale(1.03)")
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
                                onClick={() =>
                                  handleImageClick(resident.CnicFile)
                                }
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff66")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff33")
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
                                (e.currentTarget.style.transform =
                                  "scale(1.03)")
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
                                onClick={() =>
                                  handleImageClick(resident.NocFile)
                                }
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff66")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff33")
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
                                (e.currentTarget.style.transform =
                                  "scale(1.03)")
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
                                onClick={() =>
                                  handleImageClick(resident.CantFile)
                                }
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff66")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "#ffffff33")
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
                  <form action="PUT" onSubmit={updateHandler}>
                    <div className="form-check">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input form-check-input-yes"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          onClick={() => {
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
                                boxShadow:
                                  "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                              }}
                            />
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
                                boxShadow:
                                  "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                                  boxShadow:
                                    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                }}
                              >
                                <option
                                  value=""
                                  style={{
                                    background: "transparent",
                                    color: "black",
                                  }}
                                >
                                  Ownership
                                </option>
                                <option
                                  value="owner"
                                  style={{
                                    background: "transparent",
                                    color: "black",
                                  }}
                                >
                                  Owner
                                </option>
                                <option
                                  value="tanent"
                                  style={{
                                    background: "transparent",
                                    color: "black",
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
                          onClick={() => {
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
                      <button
                        type="submit"
                        className="btn btn-outline-success mt-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Styling object (same as before)
const inputStyle = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid white",
  borderRadius: "12px",
  textIndent: "12px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
};

export default ResidentDetail;
