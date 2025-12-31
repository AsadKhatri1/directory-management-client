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
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [selectedStartDate, setSelectedStartDate] = useState(
    moment().startOf("year")
  );
  const [selectedEndDate, setSelectedEndDate] = useState(moment());

  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const handleGenerateReport = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);

    const today = new Date().toISOString().split("T")[0];
    let currentY = 22;

    // Income Report Section
    let totalIncome = 0;
    if (incomeList && incomeList.length > 0) {
      doc.text("Income Report", 14, currentY);
      currentY += 8;

      const incomeColumns = [
        { header: "Resident Name", dataKey: "ResidentName" },
        { header: "Amount", dataKey: "Amount" },
        { header: "Type", dataKey: "Type" },
        { header: "Reason", dataKey: "Reason" },
        { header: "House No", dataKey: "HouseNo" },
        { header: "Ownership", dataKey: "Ownership" },
        { header: "Created At", dataKey: "createdAt" },
      ];

      const incomeRows = incomeList.map((income) => {
        totalIncome += Number(income.Amount || 0);
        return {
          ...income,
          createdAt: new Date(income.createdAt).toLocaleDateString(),
        };
      });

      doc.autoTable({
        columns: incomeColumns,
        body: incomeRows,
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: [51, 122, 183] },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        },
      });
    }

    // Expense Report Section
    let totalExpense = 0;
    if (expenseList && expenseList.length > 0) {
      doc.setFontSize(18);
      doc.text("Expense Report", 14, currentY);
      currentY += 8;

      const expenseColumns = [
        { header: "Title", dataKey: "Title" },
        { header: "Amount", dataKey: "Amount" },
        { header: "Type", dataKey: "Type" },
        { header: "Account", dataKey: "account" },
        { header: "Date", dataKey: "createdAt" },
      ];

      const expenseRows = expenseList.map((expense) => {
        totalExpense += Number(expense.Amount || 0);
        return {
          ...expense,
          createdAt: expense.createdAt
            ? new Date(expense.createdAt).toLocaleDateString()
            : "N/A",
        };
      });

      doc.autoTable({
        columns: expenseColumns,
        body: expenseRows,
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: [51, 122, 183] },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        },
      });
    }

    // Summary Table
    const summaryColumns = [
      { header: "Category", dataKey: "category" },
      { header: "Total Amount", dataKey: "total" },
    ];

    const summaryRows = [
      { category: "Total Income", total: totalIncome.toLocaleString() },
      { category: "Total Expense", total: totalExpense.toLocaleString() },
      {
        category: "Net Balance",
        total: (totalIncome - totalExpense).toLocaleString(),
      },
    ];

    doc.setFontSize(18);
    doc.text("Summary", 14, currentY);
    currentY += 8;

    doc.autoTable({
      columns: summaryColumns,
      body: summaryRows,
      startY: currentY,
      theme: "grid",
      headStyles: { fillColor: [51, 122, 183] },
      styles: { fontSize: 14 },
    });

    doc.save(`All-income-&-Expense-report-${today}.pdf`);
  };

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImageUrl("");
  };

  const filteredExpenseList = expenseList.filter((e) => {
    const expenseDate = moment(e?.createdAt);
    return (
      expenseDate.isSameOrAfter(selectedStartDate, "month") &&
      expenseDate.isSameOrBefore(selectedEndDate, "month") &&
      (selectedAccount ? e.account === selectedAccount : true) &&
      (selectedType === "expense" || selectedType === "" ? true : false)
    );
  });

  const filteredIncomeList = incomeList.filter((e) => {
    const incomeDate = moment(e?.createdAt);
    return (
      incomeDate.isSameOrAfter(selectedStartDate, "month") &&
      incomeDate.isSameOrBefore(selectedEndDate, "month") &&
      (selectedAccount ? e.account === selectedAccount : true) &&
      (selectedType === "income" || selectedType === "" ? true : false)
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = "";
      if (File) {
        const formData = new FormData();
        formData.append("file", File);
        formData.append("upload_preset", "images_preset");
        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload`,
          formData
        );
        fileUrl = await cloudinaryRes.data.secure_url;
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
        setType("");
        setDate("");
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

  const submitFundHandler = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = "";
      if (File) {
        const formData = new FormData();
        formData.append("file", File);
        formData.append("upload_preset", "images_preset");
        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload`,
          formData
        );
        fileUrl = await cloudinaryRes.data.secure_url;
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
        setFundAmount("");
        setFullName("");
        setReason("");
        setDate("");
        setFile(null);
        allExpenses();
        allIncomes();
        getMasjidBalance();
        getRecBalance();
        toast.success("Successfully added donation and updated balance");
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
          const re = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) + feeAmountNumber;

          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
            { Balance: finalMasjidBalance }
          );
        }

        allExpenses();
        getMasjidBalance();
        getRecBalance();
        allIncomes();
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
          const re = await axios.get(
            `${backendURL}/api/v1/acc/getBalance/667fcfe14a76b7ceb03176da`
          );
          const finalMasjidBalance =
            parseFloat(re.data.acc.Balance) - feeAmountNumber;

          await axios.put(
            `${backendURL}/api/v1/acc/updateBalance/667fcfe14a76b7ceb03176da`,
            { Balance: finalMasjidBalance }
          );
        }
        allIncomes();
        getMasjidBalance();
        getRecBalance();
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

  const allIncomes = async () => {
    const res = await axios.get(`${backendURL}/api/v1/income/allIncomes`);
    if (res.data.success) {
      setIncomeList(res.data.incomeList);
    }
  };

  useEffect(() => {
    allExpenses();
    allIncomes();
    getRecBalance();
    getMasjidBalance();
  }, []);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [selectedIncomeImageUrl, setSelectedIncomeImageUrl] = useState("");

  const handleIncomeImageClick = (url) => {
    setSelectedIncomeImageUrl(url);
    setShowIncomeModal(true);
  };

  const handleCloseIncomeModal = () => {
    setShowIncomeModal(false);
  };

  const FilterGenerateReport = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);

    const today = new Date().toISOString().split("T")[0];
    let currentY = 22;

    // Income Report Section
    let totalIncome = 0;
    if (filteredIncomeList && filteredIncomeList.length > 0) {
      doc.text("Income Report", 14, currentY);
      currentY += 8;

      const incomeColumns = [
        { header: "Resident Name", dataKey: "ResidentName" },
        { header: "Amount", dataKey: "Amount" },
        { header: "Type", dataKey: "Type" },
        { header: "Reason", dataKey: "Reason" },
        { header: "House No", dataKey: "HouseNo" },
        { header: "Ownership", dataKey: "Ownership" },
        { header: "Created At", dataKey: "createdAt" },
      ];

      const incomeRows = filteredIncomeList.map((income) => {
        totalIncome += Number(income.Amount || 0);
        return {
          ...income,
          createdAt: new Date(income.createdAt).toLocaleDateString(),
        };
      });

      doc.autoTable({
        columns: incomeColumns,
        body: incomeRows,
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: [51, 122, 183] },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        },
      });
    }

    // Expense Report Section
    let totalExpense = 0;
    if (filteredExpenseList && filteredExpenseList.length > 0) {
      doc.setFontSize(18);
      doc.text("Expense Report", 14, currentY);
      currentY += 8;

      const expenseColumns = [
        { header: "Title", dataKey: "Title" },
        { header: "Amount", dataKey: "Amount" },
        { header: "Type", dataKey: "Type" },
        { header: "Account", dataKey: "account" },
        { header: "Date", dataKey: "createdAt" },
      ];

      const expenseRows = filteredExpenseList.map((expense) => {
        totalExpense += Number(expense.Amount || 0);
        return {
          ...expense,
          createdAt: expense.createdAt
            ? new Date(expense.createdAt).toLocaleDateString()
            : "N/A",
        };
      });

      doc.autoTable({
        columns: expenseColumns,
        body: expenseRows,
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: [51, 122, 183] },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        },
      });
    }

    // Summary Table
    const summaryColumns = [
      { header: "Category", dataKey: "category" },
      { header: "Total Amount", dataKey: "total" },
    ];

    const summaryRows = [
      { category: "Total Income", total: totalIncome.toLocaleString() },
      { category: "Total Expense", total: totalExpense.toLocaleString() },
      {
        category: "Net Balance",
        total: (totalIncome - totalExpense).toLocaleString(),
      },
    ];

    doc.setFontSize(18);
    doc.text("Summary", 14, currentY);
    currentY += 8;

    doc.autoTable({
      columns: summaryColumns,
      body: summaryRows,
      startY: currentY,
      theme: "grid",
      headStyles: { fillColor: [51, 122, 183] },
      styles: { fontSize: 14 },
    });

    doc.save(`Filtered-Income-&-Expense-report-${today}.pdf`);
  };

  return (
    <>
      <main className="main-container text-center mt-3">
        <div className="row my-4">
          <div className="col-md-12 d-flex justify-content-end gap-2">
            <button
              className="btn btn-success rounded"
              onClick={() => {
                setShowF(true);
                setShow(false);
              }}
            >
              + Donations
            </button>

            <button
              className="btn btn-danger rounded"
              onClick={() => {
                setShow(true);
                setShowF(false);
              }}
            >
              + Expense
            </button>
          </div>
        </div>




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


        <div className="row">
          <div className="row mx-0">
            <div className="d-flex justify-content-end my-3 gap-3">
              <button
                className="btn btn-success"
                onClick={FilterGenerateReport}
                disabled={filteredExpenseList.length === 0}
              >
                Generate Filtered Report
              </button>

              <button
                className="btn btn-success"
                onClick={handleGenerateReport}
                disabled={expenseList.length === 0}
              >
                Generate Full Report
              </button>
            </div>
          </div>
          {/* Permanent Filter Bar */}
          <div
            className="mb-4 p-4 mt-4"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="row g-3 align-items-end">
              {/* Filter by Account */}
              <div className="col-md-3">
                <label className="form-label fw-semibold text-start d-block" style={{ color: '#374151' }}>
                  Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="form-select"
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.9375rem'
                  }}
                >
                  <option value="">All Accounts</option>
                  <option value="rec">REC</option>
                  <option value="masjid">Masjid</option>
                </select>
              </div>

              {/* Filter by Type */}
              <div className="col-md-3">
                <label className="form-label fw-semibold text-start d-block" style={{ color: '#374151' }}>
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select"
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.9375rem'
                  }}
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Filter by Date Range */}
              <div className="col-md-4">
                <label className="form-label fw-semibold text-start d-block" style={{ color: '#374151' }}>
                  Date Range
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="month"
                    className="form-control"
                    value={selectedStartDate.format("YYYY-MM")}
                    onChange={(e) =>
                      setSelectedStartDate(moment(e.target.value))
                    }
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.9375rem'
                    }}
                  />
                  <span className="text-muted">to</span>
                  <input
                    type="month"
                    className="form-control"
                    value={selectedEndDate.format("YYYY-MM")}
                    onChange={(e) =>
                      setSelectedEndDate(moment(e.target.value))
                    }
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>



            </div>
          </div>

          <div className="col-md-12 mt-4">
            <h2 className="mb-3" style={{ color: '#111827', fontWeight: 700 }}>Incomes</h2>
            <div className="table-responsive rounded inTable">
              <table className="table table-hover" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <tr className="text-center py-5">
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Date
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Resident
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      House Number
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Amount
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Account
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Residency
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Type
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#111827", fontWeight: 600 }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentIncomes.map((e, i) => (
                    <tr key={i} className="text-center align-middle" style={{ borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e?.ResidentName}</td>
                      <td>{e?.HouseNo}</td>
                      <td>{e?.Amount}</td>
                      <td>{e?.account || "null"}</td>
                      <td>{e?.Ownership}</td>
                      <td>{e?.Type}</td>

                      <td>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}
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

            <div className="d-flex justify-content-center my-3">
              <button
                className="btn mx-2"
                onClick={() => paginateIncomes(currentPageIncome - 1)}
                disabled={currentPageIncome === 1}
                style={{ backgroundColor: "#03bb50", color: "white" }}
              >
                Previous
              </button>
              <span className="mx-2 my-2">
                Page {currentPageIncome} of{" "}
                {Math.ceil(filteredIncomeList.length / incomesPerPage)}
              </span>
              <button
                className="btn mx-2"
                onClick={() => paginateIncomes(currentPageIncome + 1)}
                disabled={
                  currentPageIncome ===
                  Math.ceil(
                    filteredIncomeList.length === 0
                      ? 1
                      : filteredIncomeList.length / incomesPerPage
                  )
                }
                style={{ backgroundColor: "#03bb50", color: "white" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-md-12 mt-4">
            <h2 className="mb-3" style={{ color: '#111827', fontWeight: 700 }}>Expenses</h2>
            <div className="table-responsive rounded inTable">
              <table className="table table-hover" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <tr className="text-center py-5">
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Date
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Title
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Amount
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Type
                    </th>
                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Account
                    </th>

                    <th className="py-3 fs-5" style={{ color: "#111827", fontWeight: 600 }}>
                      Document
                    </th>
                    <th
                      scope="col"
                      className="py-3 fs-5"
                      style={{ color: "#111827", fontWeight: 600 }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentExpenses.map((e, i) => (
                    <tr key={i} className="text-center align-middle" style={{ borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                      <td>{moment(e?.createdAt).format("MMMM Do, YYYY")}</td>
                      <td>{e?.Title}</td>
                      <td>{e?.Amount}</td>
                      <td>{e?.Type}</td>
                      <td>{e?.account || "null"}</td>

                      <td
                        onClick={() => handleImageClick(e?.fileUrl)}
                        style={{ cursor: "pointer" }}
                      >
                        {e?.fileUrl && <IoDocumentsSharp />}
                      </td>
                      <td>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}
                          onClick={() =>
                            handleDeleteExpense(e._id, e.Amount, e.account)
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

            <div className="d-flex justify-content-center my-3">
              <button
                className="btn mx-2"
                onClick={() => paginateExpenses(currentPageExpense - 1)}
                disabled={currentPageExpense === 1}
                style={{ backgroundColor: "#03bb50", color: "white" }}
              >
                Previous
              </button>
              <span className="mx-2 my-2">
                Page {currentPageExpense} of{" "}
                {Math.ceil(filteredExpenseList.length / expensesPerPage)}
              </span>
              <button
                className="btn mx-2"
                onClick={() => paginateExpenses(currentPageExpense + 1)}
                disabled={
                  currentPageExpense ===
                  Math.ceil(filteredExpenseList.length / expensesPerPage)
                }
                style={{ backgroundColor: "#03bb50", color: "white" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal show={show} onHide={() => setShow(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              />{" "}
              <br />
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setType(e.target.value)}
                  className="form-select my-3 w-100 py-2"
                  style={{
                    backgroundColor: "white",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <option>Select Type</option>
                  <option value="Wages And Salaries Mosque">Wages And Salaries Mosque</option>
                  <option value="Utilities Mosque">Utilities Mosque</option>
                  <option value="Mosque Jamia Expense">Mosque Jamia Expense</option>
                  <option value="Mosque Jamia Repair & Maintenance">Mosque Jamia Repair & Maintenance</option>
                  <option value="Mosque Tayyaba Expense">Mosque Tayyaba Expense</option>
                  <option value="Mosque Tayyaba Repair & Maintenance">Mosque Tayyaba Repair & Maintenance</option>
                  <option value="Mosque Withholding Tax">Mosque Withholding Tax</option>
                  <option value="Solar Expense Account">Solar Expense Account</option>
                  <option value="Ramzan Sehro Ifftar Expense 2023">Ramzan Sehro Ifftar Expense 2023</option>
                  <option value="Wages and Salaries WARD">Wages and Salaries WARD</option>
                  <option value="Wages And Salary (Yoga)">Wages And Salary (Yoga)</option>
                  <option value="Utility WARD">Utility WARD</option>
                  <option value="WARD General Expenses">WARD General Expenses</option>
                  <option value="WARD Printing & Stationery">WARD Printing & Stationery</option>
                  <option value="WARD Repairs and Maintenance">WARD Repairs and Maintenance</option>
                  <option value="WARD Withholding Tax">WARD Withholding Tax</option>
                  <option value="WARD XERO Monthly Subscription">WARD XERO Monthly Subscription</option>
                  <option value="Qurbani Expense">Qurbani Expense</option>
                  <option value="Z Refund Contribution">Z Refund Contribution</option>
                  <option value="Secuirity Deposit">Secuirity Deposit</option>
                  <option value="Audit Fee">Audit Fee</option>
                </select>
              </div>
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setAccount(e.target.value)}
                  className="form-select mt-4 w-100 py-2"
                  style={{
                    backgroundColor: "white",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <option>Select Account</option>
                  <option value="rec">REC</option>
                  <option value="masjid">Masjid</option>
                </select>
              </div>
              <br />
              <label
                className="w-75 mb-3 py-2 mx-auto"
                style={{
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  display: "block",
                  textAlign: "center"
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
          </Modal.Body>
        </Modal>

        <Modal show={showF} onHide={() => setShowF(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Donation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              />{" "}
              <input
                type="text"
                placeholder="Reason for donations"
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
                name="reason"
                id="reason"
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              ></input>
              <input
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                name="reason"
                id="reason"
                className="w-75 my-3 py-2"
                style={{
                  background: "white",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              ></input>
              <div className="w-75 mx-auto">
                <select
                  onChange={(e) => setAccount(e.target.value)}
                  className="form-select my-3 w-100 py-2"
                  style={{
                    backgroundColor: "white",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <option>Select Account</option>
                  <option value="rec">REC</option>
                  <option value="masjid">Masjid</option>
                </select>
              </div>
              <label
                className="w-75 mb-3 py-2 mx-auto"
                style={{
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  display: "block",
                  textAlign: "center"
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
          </Modal.Body>
        </Modal>

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

        {/* Expense Document Modal */}
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
      </main>
    </>
  );
};

export default ExpenseForm;
