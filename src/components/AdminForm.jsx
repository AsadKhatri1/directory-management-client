import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminForm = () => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://directory-management.onrender.com/api/v1/admin/add",
        {
          FullName,
          Email,
          Phone,
          Password,
        }
      );
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
          id="Phone"
          placeholder="Phone"
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
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="Password"
          id="Password"
          placeholder="Password"
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
          REGISTER
        </button>
      </form>
    </main>
  );
};

export default AdminForm;
