import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdDownload } from "react-icons/io";
import { FaChevronCircleLeft } from "react-icons/fa";

const IncomeReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIncomes = location.state?.data || [];
  const reportRef = useRef();

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");

    // Add the title
    doc.setFontSize(18);
    doc.text("Income Report", 14, 22);

    // Define the columns
    const columns = [
      { header: "Resident Name", dataKey: "ResidentName" },
      { header: "Amount", dataKey: "Amount" },
      { header: "Type", dataKey: "Type" },
      { header: "Reason", dataKey: "Reason" },
      { header: "House No", dataKey: "HouseNo" },
      { header: "Ownership", dataKey: "Ownership" },
      { header: "Created At", dataKey: "createdAt" },
    ];

    // Define the rows
    const rows = currentIncomes.map((income) => ({
      ...income,
      createdAt: new Date(income.createdAt).toLocaleDateString(),
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
    doc.save(`income-report-${formattedDate}.pdf`);
  };

  return (
    <div>
      <div className="container">
        <div ref={reportRef}>
          <h1>Income Report</h1>

          {currentIncomes.length > 0 ? (
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
                    Resident Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Amount
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Type
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Reason
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    House No
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Ownership
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentIncomes.map((income) => (
                  <tr key={income._id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.ResidentName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.Amount}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.Type}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.Reason || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.HouseNo || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {income.Ownership || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {new Date(income.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No income data available.</p>
          )}
        </div>

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary my-4"
              onClick={() => navigate("/dashboard/expense")}
            >
              <FaChevronCircleLeft /> Back
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

export default IncomeReport;
