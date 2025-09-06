import React from 'react';
import CreateViolationForm from '../components/CreateViolationForm';
import logo from '../assets/logo.png';

const CreateViolation = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}
    >
      <div
        className="card shadow-lg border-0 my-5"
        style={{ width: '700px', borderRadius: '12px' }}
      >
        {/* Card Header */}
        <div
          className="card-header text-white"
          style={{
            background: 'linear-gradient(90deg, #009843, #03bb50)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          <h3 className="mb-0 text-center">Report a Society Violation</h3>
        </div>

        {/* Card Body */}
        <div className="card-body p-4">
          <p className="text-muted text-center mb-4">
            Please fill in the details below to report a violation in your
            society. All reports will be reviewed by the management.
          </p>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{ marginTop: '-45px' }}
          >
            <img
              src={logo}
              alt="Logo"
              className="icon-header"
              style={{ height: '200px', width: '160px' }}
            />
          </div>

          <CreateViolationForm baseUrl="https://directory-management-g8gf.onrender.com/api/v1" />
        </div>

        {/* Card Footer */}
        <div
          className="card-footer text-center text-muted"
          style={{
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        >
          🛡️ Your report will remain confidential and reviewed promptly.
        </div>
      </div>
    </div>
  );
};

export default CreateViolation;
