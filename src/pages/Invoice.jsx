import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
const Invoice = () => {
  const componentRef = useRef();
  const resident = JSON.parse(localStorage.getItem("resident"));
  const months = JSON.parse(localStorage.getItem("months"));
  const amount = JSON.parse(localStorage.getItem("amount"));
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  return (
    <div className="main d-flex flex-column align-items-center justify-content-center vw-100 vh-100 p-3">
      <div
        ref={componentRef}
        className="invoice border   d-flex flex-column align-items-center justify-content-center p-5 rounded"
        style={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0p",
        }}
      >
        <h2 className="text-center my-2">PAYMENT INVOICE</h2>
        <hr style={{ width: "80%", height: "2px" }} />

        <div className=" d-flex flex-column align-items-end justify-content-center w-100 my-5">
          <span className="my-1">
            <h6 className="d-inline">FULL NAME : </h6>
            <p className="d-inline">{resident.FullName}</p>
          </span>
          <span className="my-1">
            <h6 className="d-inline">EMAIL : </h6>
            <p className="d-inline">{resident.Email}</p>
          </span>
          <span className="my-1">
            <h6 className="d-inline">Number Of Months : </h6>
            <p className="d-inline">{months}</p>
          </span>
          <span className="my-1">
            <h6 className="d-inline">Total Fee : </h6>
            <p className="d-inline">{amount}</p>
          </span>
          <span className="my-1">
            <h6 className="d-inline">Date: </h6>
            <p className="d-inline">{day + "/" + month + "/" + year}</p>
          </span>
        </div>
        <div
          className="black w-100 mb-4 rounded"
          style={{ height: "8px", backgroundColor: "black" }}
        ></div>
        <div className="total">
          <h4>
            Total: <span className="fw-400 text-success">Rs.{amount}</span>
          </h4>
        </div>
      </div>
      <ReactToPrint
        trigger={() => (
          <button className="mt-3 btn btn-outline-secondary">
            Print / Download
          </button>
        )}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default Invoice;
