import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const ResidentForm = () => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [HouseNumber, setHouseNumber] = useState("");
  const [Profession, setProfession] = useState("");
  const [officeTel, setOfficeTel] = useState("");
  const [Qualification, setQualification] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [NOCHolder, setNOCHolder] = useState("");
  const [NOCIssue, setNOCIssue] = useState("");
  const [NOCNo, setNOCNo] = useState("");
  const [DOB, setDOB] = useState("");
  const [CNIC, setCNIC] = useState("");
  const [Photo, setPhoto] = useState("");
  const [vehicles, setVehicles] = useState([
    { type: "", make: "", model: "", year: "", registrationNumber: "" },
  ]);
  // const [Relation, setRelation] = useState("");
  // const [RelativeName, setRelativeName] = useState(""); // New state for relative name
  const [relatives, setRelatives] = useState([{ name: "", relation: "" }]); // Array to hold relative information
  const navigate = useNavigate();

  //--------------------- function for submitting form ----------------------

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://directory-management.onrender.com/api/v1/resident/add",
        {
          Photo,
          FullName,
          Email,
          Phone,
          HouseNumber,
          CNIC,
          Profession,
          Qualification,
          DOB,
          NOCHolder,
          bAddress,
          officeTel,
          NOCIssue,
          NOCNo,
          vehicles,
          relatives,
        }
      );
      if (response.data.success) {
        console.log(response.data);
        toast.success(response.data.message);
        setCNIC("");
        setEmail("");
        setFullName("");
        setHouseNumber("");
        setProfession("");
        setQualification("");
        setPhone("");
        navigate("/dashboard/residents");
      }
    } catch (err) {
      toast.error(err?.response?.data.message);
    }
  };
  console.log(NOCIssue);
  const handleVehicleChange = (index, event) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][event.target.name] = event.target.value;
    setVehicles(updatedVehicles);
  };

  const addVehicleField = () => {
    setVehicles([
      ...vehicles,
      { type: "", make: "", model: "", year: "", registrationNumber: "" },
    ]);
  };

  const handleRelativeChange = (index, name, event) => {
    const { value } = event.target;
    const updatedRelatives = [...relatives];
    updatedRelatives[index][name] = value;
    setRelatives(updatedRelatives);
  };
  const addRelativeField = () => {
    setRelatives([...relatives, { name: "", relation: "" }]);
  };

  return (
    <main className="main-container text-center mt-5">
      <h1>Add A New Resident</h1>

      <form action="post" className="w-100 mt-3" onSubmit={submitHandler}>
        <div className="row text-center justify-content-center pt-2 ">
          <div className="col-md-6">
            <label
              htmlFor="Photo"
              className="btn btn-outline-secondary w-75 "
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid white",
                borderRadius: "12px",
                textIndent: "12px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
            >
              {Photo ? Photo.name : "Upload image"}
              <input
                placeholder="Resident Image"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                name="Photo"
                id="Photo"
                hidden
                onChange={(e) => setPhoto(e.target.files[0])}
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
            </label>
            <br />
            {/* image preview */}
            {Photo && (
              <img
                src={URL.createObjectURL(Photo)}
                alt="photo"
                className="mt-3 rounded"
                style={{ height: "150px", width: "150px" }}
              />
            )}
            <br />
            <input
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              name="FullName"
              id="FullName"
              placeholder="Full Name"
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
            <input
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="Email"
              id="Email"
              placeholder="Email"
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
            <input
              value={Profession}
              onChange={(e) => setProfession(e.target.value)}
              type="text"
              name="Profession"
              id="Profession"
              placeholder="Profession"
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
            <input
              value={Qualification}
              onChange={(e) => setQualification(e.target.value)}
              type="text"
              name="Profession"
              id="Profession"
              placeholder="Qualification"
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
            <input
              value={Phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              name="Phone"
              minLength="11"
              id="Phone"
              placeholder="Phone Number"
              className="w-75 my-3 text-white py-2"
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
              value={HouseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              type="text"
              name="HouseNumber"
              id="HouseNumber"
              placeholder="House Number"
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
              value={CNIC}
              onChange={(e) => setCNIC(e.target.value)}
              type="text"
              name="CNIC"
              id="CNIC"
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
            <br />
            <label htmlFor="date">Date Of Birth</label> <br />
            <input
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              type="date"
              name="date"
              id="date"
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
            />{" "}
            <br />
            <div className="mt-3">
              <span className="blockquote-footer my-3 fw-bold fs-6">
                Enter Family Members
              </span>

              {/* Relative Fields */}
              {relatives.map((relative, index) => (
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
                    onChange={(e) => handleRelativeChange(index, "relation", e)}
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
                </div>
              ))}
              <button
                type="button"
                onClick={addRelativeField}
                className="btn btn-outline-primary m-5 mt-2"
              >
                <FaPlus /> Members
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <input
              value={officeTel}
              onChange={(e) => setOfficeTel(e.target.value)}
              type="tel"
              name="officeTel"
              id="office tel"
              placeholder="Tel (office)"
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
            <textarea
              value={bAddress}
              onChange={(e) => setBAddress(e.target.value)}
              type="text"
              name="business address"
              id="business address"
              placeholder="Business/Office Address"
              className="w-75 my-3 text-white py-2"
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
              value={NOCHolder}
              onChange={(e) => setNOCHolder(e.target.value)}
              type="text"
              name="noc"
              id="noc"
              placeholder="NOC Holder's Name"
              className="w-75 my-3 text-white py-2"
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
            <label htmlFor="nocIssue mt-2">Date Of NOC Issuance</label>
            <input
              value={NOCIssue}
              onChange={(e) => setNOCIssue(e.target.value)}
              type="date"
              name="nocIssue"
              id="nocIssue"
              placeholder="NOC Issueance Date"
              className="w-75 my-3 text-white py-2"
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
              value={NOCNo}
              onChange={(e) => setNOCNo(e.target.value)}
              type="text"
              name="nocno"
              id="nocno"
              placeholder="NOC Number"
              className="w-75 my-3 text-white py-2"
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
            <div className="text-center mt-3">
              <span className="blockquote-footer my-3 fw-bold fs-6">
                Enter vehicle details
              </span>
              {/* Vehicle Fields */}
              {vehicles.map((vehicle, index) => (
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
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    }}
                  />
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
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addVehicleField}
                className="btn btn-outline-primary m-5 mt-2"
              >
                <FaPlus /> Vehicles
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-75 mt-1"
            style={{ borderRadius: "12px" }}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </main>
  );
};

export default ResidentForm;
