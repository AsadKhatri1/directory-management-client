import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResidentForm = () => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [HouseNumber, setHouseNumber] = useState("");
  const [CNIC, setCNIC] = useState("");
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
        { FullName, Email, Phone, HouseNumber, CNIC, vehicles, relatives },
        {
          headers: {
            "Access-Control-Allow-Origin":
              "https://directory--sigma.vercel.app",
            // Add other custom headers if needed
          },
        }
      );
      if (response.data.success) {
        console.log(response.data);
        toast.success(response.data.message);
        setCNIC("");
        setEmail("");
        setFullName("");
        setHouseNumber("");
        setPhone("");
        navigate("/dashboard/residents");
      }
    } catch (err) {
      toast.error(err?.response?.data.message);
    }
  };

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
        />{" "}
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
            className="btn btn-primary m-5"
          >
            Add More Members
          </button>
        </div>
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
            className="btn btn-primary m-5"
          >
            Add More Vehicles
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-success w-75 mt-1"
          style={{ borderRadius: "12px" }}
        >
          SUBMIT
        </button>
      </form>
    </main>
  );
};

export default ResidentForm;
