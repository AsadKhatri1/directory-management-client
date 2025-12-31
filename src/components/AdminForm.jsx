import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminForm = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  const inputStyle = {
    background: "white",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "0.75rem",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/v1/admin/add`, {
        FullName,
        Email,
        Phone,
        Password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
        setFullName("");
        setPassword("");
        setPhone("");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  return (
    <main className="main-container text-center">
      <h1 className="mt-4">Add A New Admin</h1>
      <span className="blockquote-footer">
        If you register a new admin, admin will have all the access to the
        system
      </span>
      <form action="post" className="w-100 mt-3" onSubmit={submitHandler}>
        <input
          value={FullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          name="FullName"
          id="FullName"
          placeholder="Full Name"
          className="w-75 my-3 py-2"
          style={inputStyle}
        />
        <br />
        <input
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="Email"
          id="Email"
          placeholder="Email"
          className="w-75 my-3 py-2"
          style={inputStyle}
        />{" "}
        <br />
        <input
          value={Phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          name="Phone"
          id="Phone"
          placeholder="Phone"
          className="w-75 my-3 py-2"
          style={inputStyle}
        />
        <br />
        <input
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="Password"
          id="Password"
          placeholder="Password"
          className="w-75 my-3 py-2"
          style={inputStyle}
        />
        <br />
        <button
          type="submit"
          className="btn btn-success w-75 mt-5"
          style={{ borderRadius: "12px" }}
        >
          REGISTER
        </button>
      </form>
    </main>
  );
};

export default AdminForm;
