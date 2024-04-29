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

  const navigate = useNavigate();

  //--------------------- function for submitting form ----------------------

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://directory-management-api.vercel.app/resident/add",
        { FullName, Email, Phone, HouseNumber, CNIC }
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
        <button
          type="submit"
          className="btn btn-success w-75 mt-5"
          style={{ borderRadius: "12px" }}
        >
          SUBMIT
        </button>
      </form>
    </main>
  );
};

export default ResidentForm;
