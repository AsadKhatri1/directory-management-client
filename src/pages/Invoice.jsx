import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.png";

const Invoice = () => {
  const componentRef = useRef();

  // Fetch resident, months, and amount from localStorage
  const resident = JSON.parse(localStorage.getItem("resident"));
  const months = JSON.parse(localStorage.getItem("months"));
  const amount = JSON.parse(localStorage.getItem("amount"));

  // Get current date
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  // State to manage the receipt number
  const [receiptNumber, setReceiptNumber] = useState(() => {
    // Retrieve the last receipt number from local storage or set it to 0 if not found
    const lastReceiptNumber = localStorage.getItem("receiptNumber");
    return lastReceiptNumber ? parseInt(lastReceiptNumber) + 1 : 1;
  });

  useEffect(() => {
    // Update the receipt number in local storage
    localStorage.setItem("receiptNumber", receiptNumber);
  }, [receiptNumber]);

  return (
    <>
      <div className="main d-flex flex-column align-items-center justify-content-center w-100 vh-100 h-auto p-3 ">
        <div
          ref={componentRef}
          className="invoice px-4 rounded vw-100 h-100"
          style={{
            backgroundColor: "white",
            color: "black",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0p",
          }}
        >
          <div className="row h-50">
            <div className="col-md-6 border d-flex flex-column align-items-center justify-content-center py-1">
              <span style={{ opacity: "0.6" }}>REC Copy</span>
              <img
                src={logo}
                alt="logo rec"
                style={{ height: "45px", width: "40px" }}
              />
              <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                <p className="my-2">
                  Date:
                  <span className="fw-400 mx-2">
                    {day + "/" + month + "/" + year}
                  </span>
                </p>
                <p>Receipt# {receiptNumber}</p>
              </div>
              <div className="w-100">
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6>
                    Received with thanks Member <br /> Contribution / Others{" "}
                  </h6>
                  <span className="" style={{ textDecoration: "underline" }}>
                    ________________
                  </span>
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">From Mr. / Mrs. </h6>
                  <h5
                    className="mx-2 text-success"
                    style={{ textDecoration: "underline" }}
                  >
                    {resident.FullName}
                  </h5>{" "}
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">House No. </h6>
                  <h5
                    className="mx-2 text-primary mt-2"
                    style={{ textDecoration: "underline" }}
                  >
                    {resident.HouseNumber}
                  </h5>{" "}
                </div>
                <div className="d-flex w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">Cash / Cheque No. </h6>
                  <span
                    className="mx-2"
                    style={{ textDecoration: "underline" }}
                  >
                    _______________
                  </span>{" "}
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3 mt-2">
                  <h6 className="my-2">Amount</h6>
                  <h5
                    className="mx-2 text-success"
                    style={{ textDecoration: "underline" }}
                  >
                    Rs. {amount}
                  </h5>{" "}
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">Received By</h6>
                  <span
                    className="mx-2"
                    style={{ textDecoration: "underline" }}
                  >
                    ______________
                  </span>{" "}
                </div>
              </div>
            </div>
            <div className="col-md-6 border d-flex flex-column align-items-center justify-content-center py-1">
              <span style={{ opacity: "0.6" }}>Resident Copy</span>
              <img
                src={logo}
                alt="logo rec"
                style={{ height: "45px", width: "40px" }}
              />
              <div className="d-flex w-100 align-items-center justify-content-between px-3">
                <p className="my-2">
                  Date:
                  <span className="fw-400 mx-2">
                    {day + "/" + month + "/" + year}
                  </span>
                </p>
                <p>Receipt #{receiptNumber}</p>
              </div>
              <div className="w-100">
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6>
                    Received with thanks Member <br /> Contribution / Others{" "}
                  </h6>
                  <span className="" style={{ textDecoration: "underline" }}>
                    ________________
                  </span>
                </div>
                <div className="d-flex w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">From Mr. / Mrs. </h6>
                  <h5
                    className="mx-2 text-success"
                    style={{ textDecoration: "underline" }}
                  >
                    {resident.FullName}
                  </h5>
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">House No. </h6>
                  <h5
                    className="mx-2 text-primary mt-2"
                    style={{ textDecoration: "underline" }}
                  >
                    {resident.HouseNumber}
                  </h5>
                </div>
                <div className="d-flex w-100 align-items-center justify-content-between px-3 ">
                  <h6 className="my-2">Cash / Cheque No. </h6>
                  <span
                    className="mx-2"
                    style={{ textDecoration: "underline" }}
                  >
                    _______________
                  </span>{" "}
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3 mt-2">
                  <h6 className="my-2">Amount</h6>
                  <h5
                    className="mx-2 text-success"
                    style={{ textDecoration: "underline" }}
                  >
                    Rs. {amount}
                  </h5>{" "}
                </div>
                <div className="d-flex  w-100 align-items-center justify-content-between px-3">
                  <h6 className="my-2">Received By</h6>
                  <span
                    className="mx-2"
                    style={{ textDecoration: "underline" }}
                  >
                    ______________
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="row h-50">
            <div className="col-md-6 "></div>
            <div className="col-md-6 "></div>
          </div>
        </div>
      </div>
      <ReactToPrint
        trigger={() => (
          <button className="mt-3 btn btn-outline-secondary text-center my-3">
            Print / Download
          </button>
        )}
        content={() => componentRef.current}
      />
    </>
  );
};

export default Invoice;
