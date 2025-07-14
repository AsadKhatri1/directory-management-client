import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { IoIosWallet } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
import { IoDocumentsSharp } from "react-icons/io5";
const ExpenseForm = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  const [File, setFile] = useState(null);
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
  const [date, setDate] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  // const [selectedStartDate, setSelectedStartDate] = useState(moment().subtract(1,"month"));
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment().startOf("year") // January 1st of the current year
  );
  const [selectedEndDate, setSelectedEndDate] = useState(moment());

  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImageUrl("");
  };
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const filteredExpenseList = expenseList.filter((e) => {
    const expenseDate = moment(e?.createdAt);
    return (
      expenseDate.isSameOrAfter(selectedStartDate, "month") &&
      expenseDate.isSameOrBefore(selectedEndDate, "month")
    );
  });

  const filteredIncomeList = incomeList.filter((e) => {
    const incomeDate = moment(e?.createdAt);
    return (
      incomeDate.isSameOrAfter(selectedStartDate, "month") &&
      incomeDate.isSameOrBefore(selectedEndDate, "month")
    );
  });

  // Pagination
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
      `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
    );
    if (res.data.success) {
      setMasjidBalance(res.data.acc.Balance);
    }
  };

  const getRecBalance = async () => {
    const res = await axios.get(
      `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
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
      let fileUrl = "";

      if (File) {
        const formData = new FormData();
        formData.append("file", File);
        formData.append("upload_preset", "images_preset"); // replace with your upload preset
        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload`, // replace with your cloud name
          formData
        );
        fileUrl = await cloudinaryRes.data.secure_url;
        console.log(fileUrl);
      }

      const res = await axios.post(
        `${backendURL}/api/v1/expense/addExpense`,
        {
          Title,
          Amount,
          Type,
          account: Account,
          date: date,
          fileUrl,
        },
        { headers: {} }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setTitle("");
        setAmount("");
        // setAccount("");
        setType("");
        setDate("");
        setFile("");
        setFile(null);
        if (Account === "rec") {
          const feeAmountNumber = parseFloat(Amount);
          if (isNaN(feeAmountNumber)) {
            toast.error("Please enter a valid amount");
            return;
          }
          const re1 = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance = parseFloat(re1.data.acc.Balance) - Amount;

          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
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
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance = parseFloat(re.data.acc.Balance) - Amount;
          // const finalMasjidBalance = parseFloat(re.data.acc.Balance) - 10;
          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
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

  //Donation

  const submitFundHandler = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = "";

      if (File) {
        const formData = new FormData();
        formData.append("file", File);
        formData.append("upload_preset", "images_preset"); // replace with your upload preset
        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload`, // replace with your cloud name
          formData
        );
        fileUrl = await cloudinaryRes.data.secure_url;
        console.log(fileUrl);
      }

      const fundAmountNumber = parseFloat(FundAmount);

      if (isNaN(fundAmountNumber)) {
        toast.error("Please enter a valid amount");
        return;
      }
      const resIn = await axios.post(`${backendURL}/api/v1/income/addIncome`, {
        ResidentName: FullName,
        Amount: fundAmountNumber,
        account: Account,
        Reason,
        Type: "Donation",
        date: date,
        fileUrl,
      });
      if (resIn.data.success) {
        if (Account === "rec") {
          const re1 = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance =
            parseFloat(re1.data.acc.Balance) + fundAmountNumber;
          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
            { Balance: finalRecBalance }
          );
        } else if (Account === "masjid") {
          const re = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) + fundAmountNumber;
          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
            { Balance: finalMasjidBalance }
          );
        }
        setShowF(false);
        allExpenses();
        setFundAmount("");
        setFullName("");
        setReason("");
        allIncomes();
        setDate("");
        setFile("");
        getMasjidBalance();
        getRecBalance();
        toast.success("Successfully updated the balance");
      }
    } catch (err) {
      toast.error("Error in adding fund");
    }
  };

  const handleDeleteExpense = async (id, amount, account) => {
    try {
      const res = await axios.delete(
        `${backendURL}/api/v1/expense/deleteExpense/${id}`
      );

      if (res.data.success) {
        toast.success("Expense deleted successfully!");
        const feeAmountNumber = parseFloat(amount);

        if (isNaN(feeAmountNumber)) {
          toast.error("Invalid amount");
          return;
        }
        console.log("Account : ", account);
        if (account === "rec") {
          const re1 = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance =
            parseFloat(re1.data.acc.Balance) + feeAmountNumber;

          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
            { Balance: finalRecBalance }
          );
        }

        if (account === "masjid") {
          console.log("i am in masjid");

          const re = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) + feeAmountNumber;
          console.log("masjid : ", finalMasjidBalance);

          const res = await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
            { Balance: finalMasjidBalance }
          );
        }

        // Step 3: Refresh data
        allExpenses();
        getMasjidBalance();
        getRecBalance();
      } else {
        toast.error(res.data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the expense");
    }
  };

  const handleDeleteIncome = async (id, amount, account) => {
    try {
      console.log(id, amount, account);
      const res = await axios.delete(
        `${backendURL}/api/v1/income/deleteIncome/${id}`
      );

      if (res.data.success) {
        toast.success("Income Delete Successfully");
        const feeAmountNumber = parseFloat(amount);
        if (isNaN(feeAmountNumber)) {
          toast.error("Invalid amount");
          return;
        }
        if (account === "rec") {
          const re1 = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfaf4a76b7ceb03176d9`
          );
          const finalRecBalance =
            parseFloat(re1.data.acc.Balance) - feeAmountNumber;
          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfaf4a76b7ceb03176d9`,
            { Balance: finalRecBalance }
          );
        }
        if (account === "masjid") {
          console.log("i am in masjid");
          const re = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) - feeAmountNumber;
          console.log("masjid : ", finalMasjidBalance);

          const res = await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
            { Balance: finalMasjidBalance }
          );
          allIncomes();
          getMasjidBalance();
          getRecBalance();
        }
      } else {
        toast.error(res.data.message || "Failed to delete Income");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the Income");
    }
  };

  const allExpenses = async () => {
    const res = await axios.get(`${backendURL}/api/v1/expense/expenses`);
    if (res.data.success) {
      setExpenseList(res.data.expenseList);
    }
  };

  useEffect(() => {
    allExpenses();
    allIncomes();
  }, [incomeList]);

  const allIncomes = async () => {
    const res = await axios.get(`${backendURL}/api/v1/income/allIncomes`);
    if (res.data.success) {
      setIncomeList(res.data.incomeList);
    }
  };

  const handleNavigate = () => {
    navigate("/dashboard/income/report", {
      state: { data: filteredIncomeList },
    });
  };
  const handleExpenseNavigate = () => {
    navigate("/dashboard/expense/report", {
      state: { data: filteredExpenseList },
    });
  };

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [selectedIncomeImageUrl, setSelectedIncomeImageUrl] = useState("");

  const handleIncomeImageClick = (url) => {
    setSelectedIncomeImageUrl(url);
    setShowIncomeModal(true);
  };

  const handleCloseIncomeModal = () => {
    setShowIncomeModal(false);
  };
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
              <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                  <option value="WARD XERO Monthly Subscription">
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
              <label
                className="w-75 mb-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {File ? File.name : "Upload Document"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  hidden
                />
              </label>
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
              <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              <label
                className="w-75 mb-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {File ? File.name : "Upload Document"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  hidden
                />
              </label>
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
          <div
            className="cards"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            }}
          >
            <div className="card-inner">
              <h6 className="opacity-50">REC Account Balance</h6>
              <IoIosWallet className="card-icon" />
            </div>
            <h3 style={{ color: "#03bb50" }}>
              {!recBalance ? (
                <Audio
                  height="50"
                  width="50"
                  radius="9"
                  color="#03bb50"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              ) : (
                `Rs. ${recBalance}`
              )}
            </h3>
          </div>

          <div
            className="cards"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            }}
          >
            <div className="card-inner">
              <h6 className="opacity-50">Masjid Account Balance</h6>
              <IoIosWallet className="card-icon" />
            </div>
            <h2 style={{ color: "#03bb50" }}>
              {!masjidBalance ? (
                <Audio
                  height="50"
                  width="50"
                  radius="9"
                  color="#03bb50"
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
          style={{
            backgroundColor: "#263043",
            borderRadius: "12px",

            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
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
                  value={selectedStartDate.format("YYYY-MM")}
                  onChange={(e) => setSelectedStartDate(moment(e.target.value))}
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
                  value={selectedEndDate.format("YYYY-MM")}
                  onChange={(e) => setSelectedEndDate(moment(e.target.value))}
                />
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startMonth" className="mb-3">
                  Start Month:
                </label>
                <input
                  type="month"
                  className="form-control"
                  id="startMonth"
                  value={moment()
                    .year(selectedStartMonth.year()) // Use selected year
                    .month(selectedStartMonth.month()) // Use selected month
                    .format("YYYY-MM")} // Format as YYYY-MM
                  onChange={(e) =>
                    setSelectedStartMonth(moment(e.target.value, "YYYY-MM"))
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="endMonth" className="mb-3">
                  End Month:
                </label>
                <input
                  type="month"
                  className="form-control"
                  id="endMonth"
                  value={moment()
                    .year(selectedEndMonth.year()) // Use selected year
                    .month(selectedEndMonth.month()) // Use selected month
                    .format("YYYY-MM")} // Format as YYYY-MM
                  onChange={(e) =>
                    setSelectedEndMonth(moment(e.target.value, "YYYY-MM"))
                  }
                />
              </div>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-12 mt-4">
            <h2 className="mb-3">Incomes</h2>
            <div className="table-responsive rounded inTable">
              <table className="table table-dark table-hover table-striped">
                <thead className="bg-light py-5">
                  <tr className="text-center py-5">
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Date
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Resident
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      House Number
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Amount
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Reason
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Date
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Residency
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Type
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#03bb50" }}>
                      Document
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentIncomes.map((e, i) => (
                    <tr key={i} className="text-center align-middle">
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e?.ResidentName}</td>
                      <td>{e?.HouseNo}</td>
                      <td>{e?.Amount}</td>
                      <td>{e.Reason ? e.Reason : "null"}</td>
                      <td>
                        {e.date
                          ? new Date(e.date).toISOString().split("T")[0]
                          : "null"}
                      </td>
                      <td>{e?.Ownership}</td>
                      <td>{e?.Type}</td>
                      <td
                        onClick={() => handleIncomeImageClick(e?.fileUrl)}
                        style={{ cursor: "pointer" }}
                      >
                        <IoDocumentsSharp />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline text-white"
                          style={{ backgroundColor: " rgb(182, 1, 1)" }}
                          onClick={() =>
                            handleDeleteIncome(e._id, e.Amount, e.account)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Income Document Modal */}
            <Modal show={showIncomeModal} onHide={handleCloseIncomeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Income Document</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={selectedIncomeImageUrl}
                  alt="Document"
                  style={{ width: "75%" }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseIncomeModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mt-4">
            <h2 className="mb-3">Expenses</h2>

            <div className="table-responsive rounded exp-table">
              <table className="table table-dark table-hover table-striped">
                <thead className="bg-light my-3">
                  <tr className="text-center my-3">
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Document
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Receipt
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#03bb50" }}
                    >
                      Action
                    </th>
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
                        {e.date
                          ? new Date(e.date).toISOString().split("T")[0]
                          : "null"}
                      </td>
                      <td
                        onClick={() => handleImageClick(e?.fileUrl)}
                        style={{ cursor: "pointer" }}
                      >
                        <IoDocumentsSharp />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-success"
                          // style={{ backgroundColor: " rgb(3, 187, 80)" }}
                          onClick={(event) => {
                            navigate(`receipt/${e._id}`);
                            console.log(e);
                          }}
                        >
                          View
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline text-white"
                          style={{ backgroundColor: " rgb(182, 1, 1)" }}
                          onClick={() =>
                            handleDeleteExpense(e._id, e.Amount, e.account)
                          } // Use `e.Account` if stored separately
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Modal */}
                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Expense Document</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <img
                      src={selectedImageUrl}
                      alt="Document"
                      style={{ width: "75%" }}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </table>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-end py-3">
              <button
                className="btn btn-light"
                onClick={handleExpenseNavigate}
                style={{
                  fontWeight: "bold",
                  boxShadow: " 0px 2px 3px #03bb50",
                }}
              >
                View Report
              </button>
            </div>

            <div className="d-flex justify-content-center my-3">
              <button
                className="btn mx-2"
                onClick={() => paginateExpenses(currentPageExpense - 1)}
                disabled={currentPageExpense === 1}
                style={{
                  color: "rgb(3, 187, 80)",
                  backgroundColor: "white",
                  // border: "1px solid #009843",
                }}
              >
                Previous
              </button>
              <button
                className="btn mx-2"
                onClick={() => paginateExpenses(currentPageExpense + 1)}
                disabled={
                  currentPageExpense ===
                  Math.ceil(filteredExpenseList.length / expensesPerPage)
                }
                style={{
                  color: "rgb(3, 187, 80)",
                  backgroundColor: "white",
                  // border: "1px solid #009843",
                }}
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
