import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdDownload } from "react-icons/io";
import { FaChevronCircleLeft } from "react-icons/fa";

const ExpenseReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentExpenses = location.state?.data || [];
  const reportRef = useRef();

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");

    // Add the title
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);

    // Define the columns
    const columns = [
      { header: "Title", dataKey: "Title" },
      { header: "Amount", dataKey: "Amount" },
      { header: "Type", dataKey: "Type" },
      { header: "Date", dataKey: "createdAt" },
    ];

    // Define the rows
    const rows = currentExpenses.map((expense) => ({
      ...expense,
      createdAt: expense.createdAt
        ? new Date(expense.createdAt).toLocaleDateString()
        : "N/A",
    }));

    // Add the table
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [51, 122, 183] }, // Bootstrap primary color
    });

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // Save the PDF
    doc.save(`expense-report-${formattedDate}.pdf`);
  };

  return (
    <div>
      <div className="container">
        <div ref={reportRef}>
          <h1>Expense Report</h1>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              color: "white",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Title
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Amount
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Type
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {expense.Title}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {expense.Amount}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {expense.Type}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {expense.createdAt
                      ? new Date(expense.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary my-4"
              onClick={() => navigate("/dashboard")}
            >
              <FaChevronCircleLeft /> Home
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-success my-4"
              onClick={downloadPDF}
              style={{ marginBottom: "20px" }}
            >
              <IoMdDownload /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReport;
