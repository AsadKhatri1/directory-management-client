import React, { useState } from "react";
import directory from "../assets/directory.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  // -------------- submit form function ----------------------

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/admin/login`, {
        Email,
        Password,
      });
      if (res?.data?.success) {
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };

  return (
    <div className="vh-100 vw-100 bg-dark d-flex flex-row align-items-center justify-content-center">
      <div
        className="container p-0 rounded h-75 w-75 row"
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
        }}
      >
        <div className="col-md-6 text-dark rounded-start bg-light d-flex flex-column align-items-center justify-content-center">
          <h2 className="fw-bold" style={{ color: " #3C5B6F" }}>
            LOGIN
          </h2>
          <form className="w-75" onSubmit={submitHandler}>
            <div className="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={Email}
                type="email"
                className="form-control w-100"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px" }}
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={Password}
                style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px" }}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>

            <button
              type="submit"
              className="btn px-5 mt-2"
              style={{ background: "#3C5B6F", color: "white" }}
            >
              Login
            </button>
          </form>
        </div>
        <div
          className="col-md-6 text-light rounded-end d-flex flex-column align-items-center justify-content-center"
          style={{
            background: ` #3C5B6F`,
          }}
        >
          <div
            style={{
              background: ` #3C5B6F`,
            }}
          >
            <img className="w-100 h-100" src={directory} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
