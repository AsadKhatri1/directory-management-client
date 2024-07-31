import React, { useState } from "react";

import logo from "../assets/logo.png";

import { toast } from "react-toastify";
import axios from "axios";
import { IoMdEye } from "react-icons/io";
import { IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
const Auth = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();
  // -------------- submit form function ----------------------

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const res = await axios.post(
        `https://directory-management-g8gf.onrender.com/api/v1/admin/login`,
        {
          Email,
          Password,
        }
      );
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

  const passToggle = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
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
        <div className="col-md-6 text-dark rounded-start bg-light d-flex flex-column align-items-center justify-content-center my-2">
          <h2 className="fw-bold" style={{ color: " #3C5B6F" }}>
            LOGIN
          </h2>
          <form className="w-75" onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" class="form-label">
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
              <label htmlFor="exampleInputPassword1" class="form-label">
                Password
              </label>
              <div className="pass d-flex align-items-center">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={Password}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                  }}
                  type={inputType}
                  className="form-control"
                  id="exampleInputPassword1"
                />
                {inputType === "password" ? (
                  <IoMdEye
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                    onClick={passToggle}
                  />
                ) : (
                  <IoEyeOffSharp
                    style={{ marginLeft: "-30px", cursor: "pointer" }}
                    onClick={passToggle}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn px-5 mt-2"
              style={{ background: "#3C5B6F", color: "white" }}
            >
              Login
            </button>
          </form>
          <div className="row text-center mt-3">
            {showLoader ? (
              <Audio
                height="60"
                width="50"
                radius="9"
                color=" #3C5B6F"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              ""
            )}
          </div>
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
            <img
              style={{ height: "600px", width: "470px" }}
              src={logo}
              alt="logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
