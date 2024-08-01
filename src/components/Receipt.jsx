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
      <div ref={componentRef} className="border h-89 bg-white rounded w-100">
        <div className="d-flex align-items-center justify-content-center  w-100 px-5">
          <div className="col-md-6 d-flex align-items-center justify-content-start">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "200px" }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column align-items-end justify-content-center px-5 ">
            <h2 className="text-primary fw-bold">REC</h2>
            <h5 className="text-secondary fw-bold">Email</h5>
          </div>
        </div>
        <div className="text-center my-2">
          <h2 className="fw-bold text-dark">RECEIPT</h2>
          <h6 className="fw-bold text-secondary">ID - {receiptId}</h6>
        </div>
        <div className="my-4 mx-3 d-flex align-items-start justify-content-center w-100">
          <div className="left w-50 px-5 d-flex align-items-start justify-content-center">
            <h3 className="text-dark fw-bold">Title</h3>
          </div>
          <div className="right w-50 d-flex align-items-end justify-content-center">
            <h3 className="text-dark fw-bold">Amount</h3>
          </div>
        </div>
        <hr />
        <div className="my-4 mx-3 d-flex align-items-start justify-content-center w-100">
          <div className="left w-50 px-5 d-flex align-items-start justify-content-center">
            <h5 className="text-dark">{expense.Title}</h5>
          </div>
          <div className="right w-50 d-flex align-items-end justify-content-center">
            <h5 className="text-dark">Rs. {expense.Amount}</h5>
          </div>
        </div>
        <hr />

        <div className="mt-5 d-flex align-items-start justify-content-center ">
          <div className="left w-50 px-5 d-flex align-items-start justify-content-start mb-5">
            <h5 className="text-danger fw-bold">Date:</h5>
            <span className="px-2 text-danger">
              {moment(expense?.createdAt).format("MMMM Do, YYYY")}
            </span>
          </div>
          <div className="right w-50 d-flex align-items-center justify-content-end mb-5 mx-5">
            <h2 className="text-success fw-bold ">Total:</h2>
            <span className="px-2 text-success fw-bold">
              Rs. {expense.Amount}
            </span>
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
