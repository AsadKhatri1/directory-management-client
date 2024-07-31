import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.png";
import moment from "moment";
// import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const Invoice = () => {
  const componentRef = useRef();
  const now = moment();

  // Fetch resident, months, and amount from localStorage
  const resident = JSON.parse(localStorage.getItem("resident"));
  const amount = JSON.parse(localStorage.getItem("amount"));

  // State to manage the receipt number
  const [receiptNumber, setReceiptNumber] = useState(() => {
    const lastReceiptNumber = localStorage.getItem("receiptNumber");
    return lastReceiptNumber ? parseInt(lastReceiptNumber) + 1 : 1;
  });

  useEffect(() => {
    localStorage.setItem("receiptNumber", receiptNumber);
  }, [receiptNumber]);

  const invoiceSection = (copyType) => (
    <div
      className="col-12 col-md-6 border p-4"
      style={{ backgroundColor: "white" }}
    >
      <div className="row mb-1">
        <div className="col-4 d-flex align-items-center">
          <p className="mb-0">
            <strong>Date:</strong> {now.format("DD-MM-YYYY")}
          </p>
        </div>
        <div className="col-4 text-center">
          <p className="mb-0" style={{ opacity: "0.6" }}>
            {copyType}
          </p>
        </div>
        <div className="col-4 text-end">
          <p className="mb-0">
            <strong>Receipt #{receiptNumber}</strong>
          </p>
        </div>
      </div>

      <div className="text-center">
        <img src={logo} alt="Logo" style={{ height: "95px", width: "80px" }} />
      </div>

      <div className="row mb-4 text-center">
        <div className="col-12">
          <h5>Received with thanks Member Contribution / Others</h5>
        </div>
      </div>

      <div className="row mb-2 w-100 text-center">
        <div className="col-6">
          <p className="mb-1">
            <strong>From Mr. / Mrs.:</strong> {resident.FullName}
          </p>
        </div>
        <div className="col-6">
          <p className="mb-1">
            <strong>House No.:</strong> {resident.HouseNumber}
          </p>
        </div>
      </div>

      <div className="row mb-2 w-100 text-center">
        <div className="col-6">
          <p className="mb-1">
            <strong>Cash / Cheque No.:</strong> _______________
          </p>
        </div>
        <div className="col-6">
          <p className="mb-1">
            <strong>Received By:</strong> _______________
          </p>
        </div>
      </div>

      <div className="row mb-4 w-100 text-center">
        <div className="col-6">
          <p className="mb-1">
            <strong>REC Amount:</strong> Rs. {amount / 2}
          </p>
        </div>
        <div className="col-6">
          <p className="mb-1">
            <strong>Masjid Amount:</strong> Rs. {amount / 2}
          </p>
        </div>
      </div>

      <div className="row mb-1 w-100 text-center">
        <div className="col-12 text-center">
          <p
            className="mb-0"
            style={{ fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Total Amount: Rs. {amount}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="main d-flex flex-column align-items-center justify-content-start w-100 "
        style={{ height: "50vh" }}
      >
        <div
          ref={componentRef}
          className="invoice row w-100 h-100"
          style={{
            backgroundColor: "white",
            color: "black",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            width: "100%",
          }}
        >
          {invoiceSection("Office Copy")}
          {invoiceSection("Resident Copy")}
        </div>
      </div>
      <div className="text-center mt-5 ">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-secondary">Print / Download</button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </>
  );
};

export default Invoice;
