import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import moment from "moment";
import { IoIosWallet } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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
  const [selectedStartMonth, setSelectedStartMonth] = useState(
    moment().startOf("month").month()
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState(
    moment().endOf("month").month()
  );
  const [selectedYear, setSelectedYear] = useState(moment().year());

  // Filtered expenses and incomes based on selected month range and year
  const filteredExpenseList = expenseList.filter((e) => {
    const expenseDate = moment(e?.createdAt);
    return (
      expenseDate.month() >= selectedStartMonth &&
      expenseDate.month() <= selectedEndMonth &&
      expenseDate.year() === selectedYear
    );
  });

  const filteredIncomeList = incomeList.filter((e) => {
    const incomeDate = moment(e?.createdAt);
    // console.log(incomeDate.month());
    return (
      incomeDate.month() >= selectedStartMonth &&
      incomeDate.month() <= selectedEndMonth &&
      incomeDate.year() === selectedYear
    );
  });

  // Fetch balance data
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
                + Expense
              </button>
            )}
          </div>
        </div>
        {show && (
          <form className="container-sm" onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="account">Account:</label>
              <select
                className="form-control"
                id="account"
                value={Account}
                onChange={(e) => setAccount(e.target.value)}
                required
              >
                <option value="">Select Account</option>
                <option value="masjid">Masjid</option>
                <option value="rec">Rec</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        )}
        {showF && (
          <form className="container-sm" onSubmit={submitFundHandler}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason:</label>
              <input
                type="text"
                className="form-control"
                id="reason"
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fundAmount">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="fundAmount"
                value={FundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="account">Account:</label>
              <select
                className="form-control"
                id="account"
                value={Account}
                onChange={(e) => setAccount(e.target.value)}
                required
              >
                <option value="">Select Account</option>
                <option value="masjid">Masjid</option>
                <option value="rec">Rec</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        )}

        {/* Filter Section */}
        <div
          className="my-4 p-3"
          style={{ backgroundColor: "#263043", borderRadius: "12px" }}
        >
          <h3 className="my-3">Filter By Range</h3>
          <div className="row">
            <div className="col-md-6">
              {" "}
              <div className="form-group">
                <label htmlFor="startMonth" className="mb-3">
                  Start Month:
                </label>
                <input
                  type="month"
                  className="form-control"
                  id="startMonth"
                  value={moment().month(selectedStartMonth).format("YYYY-MM")}
                  onChange={(e) =>
                    setSelectedStartMonth(moment(e.target.value).month())
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              {" "}
              <div className="form-group">
                <label htmlFor="endMonth" className="mb-3">
                  End Month:
                </label>
                <input
                  type="month"
                  className="form-control"
                  id="endMonth"
                  value={moment().month(selectedEndMonth).format("YYYY-MM")}
                  onChange={(e) =>
                    setSelectedEndMonth(moment(e.target.value).month())
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h4>Expense List</h4>

            <div className="table-responsive">
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
          </div>
          <div className="col-md-6">
            <h4>Income List</h4>
            <div className="table-responsive">
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
                      <td>{e?.ResidentName}</td>
                      <td>{e?.HouseNo}</td>
                      <td>{e?.Reason}</td>
                      <td>{e?.Amount}</td>
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
