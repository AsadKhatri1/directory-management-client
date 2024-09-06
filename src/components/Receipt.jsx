import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import Expense from "../pages/Expense";
import moment from "moment";

const Receipt = () => {
  const componentRef = useRef();
  const [expense, setExpense] = useState([]);
  const { id } = useParams();
  const [receiptId, setReceiptId] = useState(null);
  const incrementedRef = useRef(false);

  const getExpense = async () => {
    const res = await axios.get(
      `https://directory-management-g8gf.onrender.com/api/v1/expense/getExpense/${id}`
    );
    if (res.data.success) {
      setExpense(res.data.expense);
    } else {
      toast.error("Error in retrieving expense");
    }
  };

  const getReceiptId = () => {
    let currentId = localStorage.getItem("receiptId");
    if (!currentId) {
      currentId = 1;
    } else {
      currentId = parseInt(currentId, 10) + 1;
    }
    localStorage.setItem("receiptId", currentId);
    setReceiptId(currentId);
  };

  useEffect(() => {
    if (!incrementedRef.current) {
      getExpense();
      getReceiptId();
      incrementedRef.current = true;
    }
  }, []);

  return (
    <div className="main d-flex flex-column vw-100 vh-100 p-3">
      <div ref={componentRef} className="w-100 h-50 bg-white d-flex">
        <div className="h-100 w-50 border">
          <div className="d-flex w-100 align-items-center justify-content-between px-5">
            {/* <h2 className="text-primary fw-bold">REC</h2> */}
            <img
              src={logo}
              alt="Logo"
              style={{ height: "100px", width: "80px" }}
            />
            <span>Office Copy</span>
            <h5 className="text-secondary fw-bold">Email</h5>
          </div>
          <div className="d-flex justify-content-center">
            <h3 className="text-dark fw-bold">RECEIPT # {receiptId}</h3>
          </div>
          <div className="d-flex w-auto align-items-center justify-content-between px-5 mx-4">
            <h4 className="text-dark fw-bold">Title</h4>
            <h4 className="text-success fw-bold">Amount</h4>
          </div>
          <div className="d-flex w-auto align-items-center justify-content-between px-5 border m-4">
            <h5 className="text-dark mt-2">{expense.Title}</h5>
            <h5 className="text-success mt-2">Rs. {expense.Amount}</h5>
          </div>
          <div className="d-flex w-100 align-items-center justify-content-between px-5 mb-1">
            <div>
              <h5 className="text-danger fw-bold">Date:</h5>
              <span className="px-2 text-danger">
                {moment(expense?.createdAt).format("MMMM Do, YYYY")}
              </span>
            </div>
            <div>
              {" "}
              <h5 className="text-success fw-bold">Total:</h5>
              <span className="px-2 text-success ">Rs. {expense.Amount}</span>
            </div>
          </div>
        </div>
        <div className="h-100 w-50 border">
          <div className="d-flex w-100 align-items-center justify-content-between px-5">
            {/* <h2 className="text-primary fw-bold">REC</h2> */}
            <img
              src={logo}
              alt="Logo"
              style={{ height: "100px", width: "80px" }}
            />
            <span>Resident Copy</span>
            <h5 className="text-secondary fw-bold">Email</h5>
          </div>
          <div className="d-flex justify-content-center">
            <h3 className="text-dark fw-bold">RECEIPT # {receiptId}</h3>
          </div>
          <div className="d-flex w-auto align-items-center justify-content-between px-5 mx-4">
            <h4 className="text-dark fw-bold">Title</h4>
            <h4 className="text-success fw-bold">Amount</h4>
          </div>
          <div className="d-flex w-auto align-items-center justify-content-between px-5 border m-4">
            <h5 className="text-dark mt-2">{expense.Title}</h5>
            <h5 className="text-success mt-2">Rs. {expense.Amount}</h5>
          </div>
          <div className="d-flex w-100 align-items-center justify-content-between px-5 mb-1">
            <div>
              <h5 className="text-danger fw-bold">Date:</h5>
              <span className="px-2 text-danger">
                {moment(expense?.createdAt).format("MMMM Do, YYYY")}
              </span>
            </div>
            <div>
              {" "}
              <h5 className="text-success fw-bold">Total:</h5>
              <span className="px-2 text-success ">Rs. {expense.Amount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <ReactToPrint
          trigger={() => (
            <button className="mt-3 btn btn-outline-secondary">
              Print / Download
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default Receipt;
