import React, { useEffect, useState } from 'react';

import logo from '../assets/logo.png';

import { toast } from 'react-toastify';
import axios from 'axios';
import { IoMdEye } from 'react-icons/io';
import { IoEyeOffSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';

const Auth = () => {
  const backendURL = 'https://directory-management-g8gf.onrender.com';
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      await setToken(localStorage.getItem('token'));
      console.log('inside fun');
      console.log(token);
    };
    fetchUserFromStorage();
  }, []);
  console.log(token);

  if (token) {
    navigate('/dashboard');
  }

  // -------------- submit form function ----------------------

  console.log('auth page');
  const submitHandler = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const res = await axios.post(`${backendURL}/api/v1/admin/login`, {
        Email,
        Password,
      });
      if (res?.data?.success) {
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message);
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };

  const passToggle = () => {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  };

  return (
    <div
      className="vh-100 vw-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      }}
    >
      <div
        className="container p-0 rounded row"
        style={{
          maxWidth: '1000px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backgroundColor: 'white',
        }}
      >
        <div className="col-12 col-md-6 text-dark rounded-start bg-white d-flex flex-column align-items-center justify-content-center p-4 p-md-5">
          <img
            src={logo}
            alt="logo"
            className="d-md-none mb-4"
            style={{ height: '80px', objectFit: 'contain' }}
          />
          <h2 className="fw-bold mb-2 mb-md-4 text-center" style={{ color: '#111827', fontSize: '1.75rem' }}>
            Welcome Back
          </h2>
          <p className="text-center" style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Sign in to access your directory
          </p>
          <form className="w-100" onSubmit={submitHandler}>
            <div className="mb-3 mb-md-4">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label"
                style={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}
              >
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={Email}
                type="email"
                className="form-control w-100"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
            <div className="mb-3 mb-md-4">
              <label
                htmlFor="exampleInputPassword1"
                className="form-label"
                style={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}
              >
                Password
              </label>
              <div className="pass d-flex align-items-center position-relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={Password}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    width: '100%'
                  }}
                  type={inputType}
                  className="form-control"
                  id="exampleInputPassword1"
                />
                {inputType === 'password' ? (
                  <IoMdEye
                    style={{
                      position: 'absolute',
                      right: '12px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                    onClick={passToggle}
                  />
                ) : (
                  <IoEyeOffSharp
                    style={{
                      position: 'absolute',
                      right: '12px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                    onClick={passToggle}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 mt-2 mt-md-3"
              style={{
                background: '#03bb50',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                border: 'none',
                fontSize: '1rem'
              }}
            >
              Sign In
            </button>
          </form>
          <div className="row text-center mt-3">
            {showLoader ? (
              <Audio
                height="60"
                width="50"
                radius="9"
                color="#03bb50"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div
          className="col-md-6 rounded-end d-none d-md-flex flex-column align-items-center justify-content-center p-5"
          style={{
            background: 'linear-gradient(135deg, #03bb50 0%, #029e43 100%)',
          }}
        >
          <div className="text-center">
            <img
              style={{ height: '400px', width: '320px', objectFit: 'contain' }}
              src={logo}
              alt="logo"
            />
            <h3 style={{ color: 'white', marginTop: '2rem', fontWeight: 600 }}>
              Directory Management System
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '1rem' }}>
              Manage your residents efficiently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
