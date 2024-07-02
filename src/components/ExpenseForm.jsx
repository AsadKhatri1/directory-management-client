import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ImCross } from "react-icons/im";
import moment from "moment";
import { IoIosWallet } from "react-icons/io";
const ExpenseForm = () => {
  const [recBalance, setRecBalance] = useState(0);
  const [masjidBalance, setMasjidBalance] = useState(0);
  const [Title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [Amount, setAmount] = useState("");
  const [Account, setAccount] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  // filter for current month expenses

  // Get the current month and year
  const currentMonth = moment().month(); // 0-based index, so January is 0
  const currentYear = moment().year();

  const filteredExpenseList = expenseList.filter((e) => {
    const expenseDate = moment(e?.createdAt);
    return (
      expenseDate.month() === currentMonth && expenseDate.year() === currentYear
    );
  });

  // getting masjid & rec balance
  const getMasjidBalance = async () => {
    const res = await axios.get(
      `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
    );
    if (res.data.success) {
      setMasjidBalance(res.data.acc.Balance);
    }
  };
  const getRecBalance = async () => {
    const res = await axios.get(
      `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
    );
    if (res.data.success) {
      setRecBalance(res.data.acc.Balance);
    }
  };

  useEffect(() => {
    getMasjidBalance();
    getRecBalance();
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://directory-management-g8gf.onrender.com/api/v1/expense/addExpense",
        {
          Title,
          Amount,
        }
      );
      if (res.data.success) {
        console.log(Account);
        toast.success(res.data.message);
        setTitle("");
        setAmount("");
        setAccount("");
        if (Account === "rec") {
          // Ensure feeAmount is parsed as a number
          const feeAmountNumber = parseFloat(Amount);

          // Check if feeAmount is a valid number
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }
          const re1 = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance = JSON.parse(re1.data.acc.Balance) - Amount;
          const res = await axios.put(
            "https://directory-management-g8gf.onrender.com/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9",
            { Balance: finalRecBalance }
          );
        }
        if (Account === "masjid") {
          // Ensure feeAmount is parsed as a number
          const feeAmountNumber = parseFloat(Amount);

          // Check if feeAmount is a valid number
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }
          const re = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance = JSON.parse(re.data.acc.Balance) - Amount;
          const res1 = await axios.put(
            "https://directory-management-g8gf.onrender.com/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da",
            { Balance: finalMasjidBalance }
          );
        }
        setShow(false);
        allExpenses();
        getMasjidBalance();
        getRecBalance();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const allExpenses = async () => {
    const res = await axios.get(
      "https://directory-management-g8gf.onrender.com/api/v1/expense/expenses"
    );
    if (res.data.success) {
      setExpenseList(res.data.expenseList);
    }
  };
  useEffect(() => {
    allExpenses();
  }, []);

  return (
    <>
      <main className="main-container text-center mt-3">
        <div className="row my-4">
          <div className="col-md-9"></div>
          <div className="col-md-3">
            {show ? (
              <ImCross
                onClick={() => setShow(!show)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <button
                className="btn btn-success rounded"
                onClick={() => setShow(!show)}
              >
                Add New Expense
              </button>
            )}
          </div>
        </div>
        <div className="row my-5">
          <div className="col-md-6 text-center">
            {" "}
            <div className="rec-card p-3 rounded my-2">
              <div className="card-inner">
                <h6 className="fw-bold">REC Account Balance</h6>
                <IoIosWallet className="card-icon" />
              </div>
              <h3 className="mt-1">RS. {recBalance}</h3>
            </div>
          </div>
          <div className="col-md-6 text-center">
            {" "}
            <div className=" masjid-card p-3 rounded my-2">
              <div className="card-inner">
                <h6 className="fw-bold ">Masjid Account Balance</h6>
                <IoIosWallet className="card-icon" />
              </div>
              <h2>RS. {masjidBalance}</h2>
            </div>
          </div>
        </div>
        {show ? (
          <>
            <h2>LIST A NEW EXPENSE</h2>
            <form
              action="post"
              className="w-100 mt-3 text-center"
              onSubmit={submitHandler}
            >
              <input
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="FullName"
                id="FullName"
                placeholder="Title"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <input
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                name="amount"
                id="Email"
                placeholder="Amount"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <br />
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setAccount(e.target.value)}
                  className="form-select my-3 w-100 py-2"
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    borderBottom: "1px solid white",
                    borderRadius: "12px",
                    textIndent: "12px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  <option>Select Account</option>
                  <option value="rec">REC</option>
                  <option value="masjid">Masjid</option>
                </select>
              </div>
              <br />
              <button
                type="submit"
                className="btn btn-success w-75 mt-1"
                style={{ borderRadius: "12px" }}
              >
                ADD
              </button>
            </form>
          </>
        ) : (
          <></>
        )}
        <div className="my-3 table-responsive mt-5">
          <h2 className="my-3">Expenses This Month</h2>
          <table className="table table-dark table-bordered table-hover">
            <thead className="bg-light">
              <tr className="text-center">
                <th scope="col">Sno.</th>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col">Amount</th>
                <th scope="col">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenseList.map((e, i) => (
                <tr key={i} className="text-center align-middle">
                  <td>{i + 1}</td>
                  <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                  <td>{e.Title}</td>
                  <td>{e.Amount}</td>
                  <td>
                    <button className="btn btn-outline-info">
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default ExpenseForm;
