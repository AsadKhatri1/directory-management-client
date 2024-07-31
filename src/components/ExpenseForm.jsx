import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import moment from "moment";
import { IoIosWallet } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [recBalance, setRecBalance] = useState(0);
  const [masjidBalance, setMasjidBalance] = useState(0);
  const [Title, setTitle] = useState("");
  const [Type, setType] = useState("");
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

  // Pagination
  const [expensesPerPage] = useState(8);
  const [currentPageExpense, setCurrentPageExpense] = useState(1);
  const [incomesPerPage] = useState(8);
  const [currentPageIncome, setCurrentPageIncome] = useState(1);

  const indexOfLastExpense = currentPageExpense * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenseList.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const indexOfLastIncome = currentPageIncome * incomesPerPage;
  const indexOfFirstIncome = indexOfLastIncome - incomesPerPage;
  const currentIncomes = filteredIncomeList.slice(
    indexOfFirstIncome,
    indexOfLastIncome
  );

  const paginateExpenses = (pageNumber) => setCurrentPageExpense(pageNumber);
  const paginateIncomes = (pageNumber) => setCurrentPageIncome(pageNumber);

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
          Type,
        }
      );
      if (res.data.success) {
        console.log(Account);
        toast.success(res.data.message);
        setTitle("");
        setAmount("");
        setAccount("");
        setType("");
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
          Type: "Donation",
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
                className="btn btn-danger rounded"
                onClick={() => {
                  setShow(!show), setShowF(false);
                }}
              >
                + Expense
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
              {/* type */}
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setType(e.target.value)}
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
                  <option>Select Type</option>
                  <option value="Wages And Salaries Mosque">
                    Wages And Salaries Mosque
                  </option>
                  <option value="Utilities Mosque">Utilities Mosque</option>
                  <option value="Mosque Jamia Expense">
                    Mosque Jamia Expense
                  </option>
                  <option value="Mosque Jamia Repair & Maintenance">
                    Mosque Jamia Repair & Maintenance
                  </option>
                  <option value="Mosque Tayyaba Expense">
                    Mosque Tayyaba Expense
                  </option>
                  <option value="Mosque Tayyaba Repair & Maintenance">
                    Mosque Tayyaba Repair & Maintenance
                  </option>
                  <option value="Mosque Withholding Tax">
                    Mosque Withholding Tax
                  </option>
                  <option value="Solar Expense Account">
                    Solar Expense Account
                  </option>
                  <option value="Ramzan Sehro Ifftar Expense 2023">
                    Ramzan Sehro Ifftar Expense 2023
                  </option>
                  <option value="Wages and Salaries WARD">
                    Wages and Salaries WARD
                  </option>
                  <option value="Wages And Salary (Yoga)">
                    Wages And Salary (Yoga)
                  </option>
                  <option value="Utility WARD">Utility WARD</option>
                  <option value="WARD General Expenses">
                    WARD General Expenses
                  </option>
                  <option value="WARD Printing & Stationery">
                    WARD Printing & Stationery
                  </option>
                  <option value="WARD Repairs and Maintenance">
                    WARD Repairs and Maintenance
                  </option>
                  <option value="WARD Withholding Tax">
                    WARD Withholding Tax
                  </option>
                  <option
                    value="WARD XERO Monthly Subscription
"
                  >
                    WARD XERO Monthly Subscription
                  </option>
                  <option value="Qurbani Expense">Qurbani Expense</option>
                  <option value="Z Refund Contribution">
                    Z Refund Contribution
                  </option>
                  <option value="Secuirity Deposit">Secuirity Deposit</option>
                  <option value="Audit Fee">Audit Fee</option>
                </select>
              </div>
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setAccount(e.target.value)}
                  className="form-select mt-4 w-100 py-2"
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

        <div className="main-finance-cards">
          <div className="cards">
            <div className="card-inner">
              <h6 className="fw-bold">REC Account Balance</h6>
              <IoIosWallet className="card-icon" />
            </div>
            <h3>
              {!recBalance ? (
                <Audio
                  height="50"
                  width="50"
                  radius="9"
                  color="white"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              ) : (
                `Rs. ${recBalance}`
              )}
            </h3>
          </div>

          <div className="cards">
            <div className="card-inner">
              <h6 className="fw-bold">Masjid Account Balance</h6>
              <IoIosWallet className="card-icon" />
            </div>
            <h2>
              {!masjidBalance ? (
                <Audio
                  height="50"
                  width="50"
                  radius="9"
                  color="white"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              ) : (
                `Rs. ${masjidBalance}`
              )}
            </h2>
          </div>
        </div>
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
                <thead className="bg-light border">
                  <tr className="text-center">
                    <th scope="col">Date</th>
                    <th scope="col">Title</th>
                    <th scope="col">Type</th>
                    <th scope="col">Amount</th>

                    <th scope="col">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExpenses.map((e, i) => (
                    <tr key={i} className="text-center align-middle">
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e.Title}</td>
                      <td>{e?.Type}</td>
                      <td>{e.Amount}</td>
                      <td>
                        <button
                          className="btn btn-outline-info"
                          onClick={(event) => navigate(`receipt/${e._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center my-3">
              <button
                className="btn btn-secondary mx-2"
                onClick={() => paginateExpenses(currentPageExpense - 1)}
                disabled={currentPageExpense === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => paginateExpenses(currentPageExpense + 1)}
                disabled={
                  currentPageExpense ===
                  Math.ceil(filteredExpenseList.length / expensesPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>

          <div className="col-md-6">
            <h4>Income List</h4>
            <div className="table-responsive">
              <table className="table table-dark table-bordered table-hover inTable">
                <thead className="bg-light border">
                  <tr className="text-center">
                    <th scope="col">Date</th>
                    <th scope="col">Resident</th>
                    <th scope="col">House Number</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Residency</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIncomes.map((e, i) => (
                    <tr key={i} className="text-center align-middle">
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e?.ResidentName}</td>
                      <td>{e?.HouseNo}</td>
                      <td>{e?.Amount}</td>
                      <td>{e?.Reason}</td>

                      <td>{e?.Ownership}</td>
                      <td>{e?.Type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center my-3">
              <button
                className="btn btn-secondary mx-2"
                onClick={() => paginateIncomes(currentPageIncome - 1)}
                disabled={currentPageIncome === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => paginateIncomes(currentPageIncome + 1)}
                disabled={
                  currentPageIncome ===
                  Math.ceil(filteredIncomeList.length / incomesPerPage)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ExpenseForm;
