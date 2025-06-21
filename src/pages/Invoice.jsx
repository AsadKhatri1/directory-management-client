import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.png";
import moment from "moment";
<<<<<<< HEAD
// import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
=======
>>>>>>> Fench

const Invoice = () => {
  const componentRef = useRef();
  const now = moment();

<<<<<<< HEAD
  // Fetch resident, months, and amount from localStorage
  const resident = JSON.parse(localStorage.getItem("resident"));
  const amount = JSON.parse(localStorage.getItem("amount"));

  // State to manage the receipt number
=======
  const resident = JSON.parse(localStorage.getItem("resident"));
  const amount = JSON.parse(localStorage.getItem("amount"));

>>>>>>> Fench
  const [receiptNumber, setReceiptNumber] = useState(() => {
    const lastReceiptNumber = localStorage.getItem("receiptNumber");
    return lastReceiptNumber ? parseInt(lastReceiptNumber) + 1 : 1;
  });

  useEffect(() => {
    localStorage.setItem("receiptNumber", receiptNumber);
  }, [receiptNumber]);

<<<<<<< HEAD
  const invoiceSection = (copyType) => (
    <div
      className="col-12 col-md-6 border px-4"
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

      <div className="row w-100 text-center">
        <div className="col-12 text-center">
          <p
            className="mb-0"
            style={{ fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Total Amount: Rs. {amount}
          </p>
        </div>
=======
  const paymentMode = localStorage.getItem("PaymentMode") || "";

  const invoiceSection = (copyType) => (
    <div className="border p-3 mb-4" style={{ backgroundColor: "white" }}>
      {/* Header Row */}
      <div className="d-flex justify-content-between mb-3">
        <p><strong>Date:</strong> {now.format("DD-MM-YYYY")}</p>
        <p style={{ opacity: 0.6 }}><strong>{copyType}</strong></p>
        <p><strong>Receipt #</strong> {receiptNumber}</p>
      </div>

      {/* Logo Centered */}
      <div className="text-center mb-3">
        <img src={logo} alt="Logo" style={{ height: "90px", width: "auto" }} />
      </div>

      {/* Title */}
       <h5 className="text-center mb-4">Received with thanks Member Contribution / Others</h5>
      {/* Resident Info */}
      <div className="row text-center mb-2">
        <div className="col-6">
          <p><strong>From:</strong> Mr. / Mrs. {resident?.FullName}</p>
        </div>
        <div className="col-6">
          <p><strong>House No.:</strong> {resident?.HouseNumber}</p>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="row text-center mb-2">
        <div className="col-6">
          <p><strong>Cash / Cheque No.:</strong> ___________________</p>
        </div>
        <div className="col-6">
          <p><strong>Received By:</strong> ___________________</p>
        </div>
      </div>

      {/* Amount Breakdown */}
      <div className="row text-center mb-3">
        <div className="col-6">
          <p><strong>REC Amount:</strong> Rs. {amount / 2}</p>
        </div>
        <div className="col-6">
          <p><strong>Masjid Amount:</strong> Rs. {amount / 2}</p>
        </div>
      </div>

      {/* Total */}
      <div className="text-center mb-2">
        <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
          Total Amount: Rs. {amount}
        </p>
      </div>

      {/* Payment Mode */}
      <div className="text-end">
        <p><strong>Payment Mode:</strong> {paymentMode}</p>
>>>>>>> Fench
      </div>
    </div>
  );

  return (
    <>
<<<<<<< HEAD
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
=======
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // full viewport height
    backgroundColor: "#f8f9fa", // optional light background
  }}
>
  <div
    ref={componentRef}
    style={{
      backgroundColor: "white",
      color: "black",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      width: "210mm",          // A4 width
      height: "297mm",         // A4 height
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
    }}
  >
    <div style={{ height: "148.5mm", borderBottom: "1px dashed #ccc", padding: "10mm" }}>
      {invoiceSection("Office Copy")}
    </div>
    <div style={{ height: "148.5mm", padding: "10mm" }}>
      {invoiceSection("Resident Copy")}
    </div>
  </div>
</div>



      <div className="text-center mt-4 print-btn">
>>>>>>> Fench
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
