import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import moment from "moment";
import { IoIosWallet } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [recBalance, setRecBalance] = useState(0);
  const [masjidBalance, setMasjidBalance] = useState(0);
  const [Title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showF, setShowF] = useState(false);
  const [Amount, setAmount] = useState("");
  const [FundAmount, setFundAmount] = useState("");
  const [FullName, setFullName] = useState("");
  const [Reason, setReason] = useState("");
  const [Account, setAccount] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());

  // Filtered expenses and incomes based on selected month and year
  const filteredExpenseList = expenseList.filter((e) => {
    const expenseDate = moment(e?.createdAt);
    return (
      expenseDate.month() === selectedMonth &&
      expenseDate.year() === selectedYear
    );
  });

  const filteredIncomeList = incomeList.filter((e) => {
    const incomeDate = moment(e?.createdAt);
    return (
      incomeDate.month() === selectedMonth && incomeDate.year() === selectedYear
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
          const feeAmountNumber = parseFloat(Amount);
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }
          const re1 = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance = parseFloat(re1.data.acc.Balance) - Amount;
          await axios.put(
            "https://directory-management-g8gf.onrender.com/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9",
            { Balance: finalRecBalance }
          );
        }
        if (Account === "masjid") {
          const feeAmountNumber = parseFloat(Amount);
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }
          const re = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance = parseFloat(re.data.acc.Balance) - Amount;
          await axios.put(
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

  const submitFundHandler = async (e) => {
    e.preventDefault();
    try {
      const fundAmountNumber = parseFloat(FundAmount);
      if (isNaN(fundAmountNumber)) {
        toast.error("Please enter a valid amount");
        return;
      }
      const resIn = await axios.post(
        "https://directory-management-g8gf.onrender.com/api/v1/income/addIncome",
        {
          ResidentName: FullName,
          Amount: fundAmountNumber,
          Reason,
        }
      );
      if (resIn.data.success) {
        if (Account === "rec") {
          const re1 = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance =
            parseFloat(re1.data.acc.Balance) + fundAmountNumber;
          await axios.put(
            "https://directory-management-g8gf.onrender.com/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9",
            { Balance: finalRecBalance }
          );
        } else if (Account === "masjid") {
          const re = await axios.get(
            `https://directory-management-g8gf.onrender.com/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) + fundAmountNumber;
          await axios.put(
            "https://directory-management-g8gf.onrender.com/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da",
            { Balance: finalMasjidBalance }
          );
        }
        setShowF(false);
        allExpenses();
        setFundAmount("");
        setFullName("");
        setReason("");
        allIncomes();
        getMasjidBalance();
        getRecBalance();
        toast.success("Successfully updated the balance");
      }
    } catch (err) {
      toast.error("Error in adding fund");
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

  const allIncomes = async () => {
    const res = await axios.get(
      "https://directory-management-g8gf.onrender.com/api/v1/income/allIncomes"
    );
    if (res.data.success) {
      setIncomeList(res.data.incomeList);
    }
  };

  useEffect(() => {
    allIncomes();
  }, []);

  return (
    <>
      <main className="main-container text-center mt-3">
        <div className="row my-4">
          <div className="col-md-3 my-2">
            {showF ? (
              <ImCross
                onClick={() => setShowF(!showF)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <button
                className="btn btn-success rounded"
                onClick={() => {
                  setShowF(!showF), setShow(false);
                }}
              >
                + Donations
              </button>
            )}
          </div>
          <div className="col-md-6"></div>
          <div className="col-md-3 my-2">
            {show ? (
              <ImCross
                onClick={() => setShow(!show)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <button
                className="btn btn-success rounded"
                onClick={() => {
                  setShow(!show), setShowF(false);
                }}
              >
                Add New Expense
              </button>
            )}
          </div>
        </div>
        {show ? (
          <div
            className="py-3 rounded"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
          >
            <h5>Add Expense</h5>
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
          </div>
        ) : (
          ""
        )}
        {showF ? (
          <div
            className="py-3 rounded"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            }}
          >
            <h5>Add Donation</h5>
            <form
              action="post"
              className="w-100 mt-3 text-center"
              onSubmit={submitFundHandler}
            >
              <input
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
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
              <input
                value={FundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
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
              <input
                type="text"
                placeholder="Reason for donations"
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
                name="reason"
                id="reason"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              ></input>
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
              <button
                type="submit"
                className="btn btn-success w-75 mt-1"
                style={{ borderRadius: "12px" }}
              >
                ADD
              </button>
            </form>
          </div>
        ) : (
          ""
        )}

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
        <div
          className="mt-3 p-3"
          style={{
            backgroundColor: "#263043",
            borderRadius: "12px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
          }}
        >
          <h5>FILTERS</h5>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="month" className="my-2">
                Select Month
              </label>
              <select
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {moment.months().map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="year" className="my-2">
                Select Year
              </label>
              <select
                className="form-control"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[...Array(10).keys()].map((_, index) => (
                  <option key={index} value={moment().year() - index}>
                    {moment().year() - index}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="container my-3">
          <div className="row">
            <div className="col-md-6">
              <h3>Expenses</h3>
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
                        <button
                          className="btn btn-outline-info"
                          onClick={(event) => navigate(`receipt/${e._id}`)}
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h3>Incomes</h3>
              <table className="table table-dark table-bordered table-hover">
                <thead className="bg-light">
                  <tr className="text-center">
                    <th scope="col">Sno.</th>
                    <th scope="col">Date</th>
                    <th scope="col">Resident</th>
                    <th scope="col">House Number</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomeList.map((e, i) => (
                    <tr key={i} className="text-center align-middle">
                      <td>{i + 1}</td>
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e.ResidentName}</td>
                      <td>{e.HouseNo}</td>
                      <td>{e.Amount}</td>
                      <td>{e.Reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ExpenseForm;
