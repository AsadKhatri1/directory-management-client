import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.png";
import moment from "moment";

const Invoice = () => {
  const componentRef = useRef();
  const now = moment();

  const resident = JSON.parse(localStorage.getItem("resident"));
  const amount = JSON.parse(localStorage.getItem("amount"));
  const months = JSON.parse(localStorage.getItem("months")) || [];
  const numberOfMonths =
    JSON.parse(localStorage.getItem("NumberOfMonths")) || [];

  const [receiptNumber, setReceiptNumber] = useState(() => {
    const lastReceiptNumber = localStorage.getItem("receiptNumber");
    return lastReceiptNumber ? parseInt(lastReceiptNumber) + 1 : 1;
  });

  useEffect(() => {
    localStorage.setItem("receiptNumber", receiptNumber);
  }, [receiptNumber]);

  const paymentMode = localStorage.getItem("PaymentMode") || "";

  // Get start and end months from the months array
  const startMonth =
    months.length > 0
      ? moment(months[0], "YYYY-MM").format("MMMM YYYY")
      : "N/A";
  const endMonth =
    months.length > 0
      ? moment(months[months.length - 1], "YYYY-MM").format("MMMM YYYY")
      : "N/A";

  const invoiceSection = (copyType) => (
    <div
      className="border p-3"
      style={{
        backgroundColor: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Row */}
      <div
        className="d-flex justify-content-between"
        style={{ marginBottom: "5px" }}
      >
        <p style={{ margin: 0, fontSize: "13px" }}>
          <strong>Date:</strong> {now.format("DD-MM-YYYY")}
        </p>
        <p style={{ opacity: 0.6, margin: 0, fontSize: "13px" }}>
          <strong>{copyType}</strong>
        </p>
        <p style={{ margin: 0, fontSize: "13px" }}>
          <strong>Receipt #</strong> {receiptNumber}
        </p>
      </div>

      {/* Logo */}
      <div className="text-center" style={{ margin: "5px 0px 2px 0px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "190px",
            width: "auto",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Title */}
      <h5
        className="text-center"
        style={{
          margin: "5px 0 8px 0",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Received with thanks Member Contribution / Others
      </h5>

      {/* Paid Months */}
      <div style={{ margin: "0 0 8px 0", textAlign: "center" }}>
        <p style={{ margin: "3px 0", fontSize: "13px" }}>
          <strong>From:</strong> {startMonth}
        </p>
        <p style={{ margin: "3px 0", fontSize: "13px" }}>
          <strong>To:</strong> {endMonth}
        </p>
        <p style={{ margin: "3px 0", fontSize: "13px" }}>
          <strong>Total Months:</strong> {months.length}
        </p>
      </div>

      {/* Resident Info */}
      <div className="row text-center" style={{ marginBottom: "8px" }}>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>From:</strong> Mr. / Mrs. {resident?.FullName || "N/A"}
          </p>
        </div>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>House No.:</strong> {resident?.HouseNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="row text-center" style={{ marginBottom: "8px" }}>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Cash / Cheque No.:</strong> ___________________
          </p>
        </div>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Received By:</strong> ___________________
          </p>
        </div>
      </div>

      {/* Amount Breakdown */}
      <div className="row text-center" style={{ marginBottom: "12px" }}>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>REC Amount:</strong> Rs. {amount ? amount / 2 : "N/A"}
          </p>
        </div>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Masjid Amount:</strong> Rs. {amount ? amount / 2 : "N/A"}
          </p>
        </div>
      </div>

      {/* Resident Type and Payment Mode */}
      <div className="row text-center" style={{ marginBottom: "8px" }}>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Resident Type:</strong> {resident?.residentType || "N/A"}
          </p>
        </div>
        <div className="col-6">
          <p style={{ margin: "3px 0", fontSize: "13px" }}>
            <strong>Payment Mode:</strong> {paymentMode || "N/A"}
          </p>
        </div>
      </div>


      <div className="text-center" style={{ margin: "8px 0" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
          Total Amount: Rs. {amount || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          ref={componentRef}
          style={{
            backgroundColor: "white",
            color: "black",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            width: "210mm",
            height: "297mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          {/* Office Copy */}
          <div
            style={{
              height: "148.5mm",
              borderBottom: "1px dashed #ccc",
              padding: "10mm",
            }}
          >
            {invoiceSection("Office Copy")}
          </div>

          {/* Resident Copy */}
          <div
            style={{
              height: "148.5mm",
              padding: "10mm",
            }}
          >
            {invoiceSection("Resident Copy")}
          </div>
        </div>
      </div>

      <div className="text-center mt-4 print-btn">
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
