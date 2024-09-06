import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";

const ResidentTable = () => {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [showTanentsOnly, setShowTanentsOnly] = useState(false);

  const allResidents = async () => {
    try {
      const res = await axios.get(
        "https://directory-management-g8gf.onrender.com/api/v1/resident/getResidents"
      );
      if (res?.data?.success) {
        setResidents(res.data.residents);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    allResidents();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `https://directory-management-g8gf.onrender.com/api/v1/resident/deleteResident/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        allResidents();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const generateFeeSlip = async (residentId) => {
    try {
      const response = await axios.post(
        `https://directory-management-g8gf.onrender.com/api/v1/resident/generateSlip/${residentId}`,
        { numberOfMonths: numberOfMonths },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        localStorage.setItem("amount", JSON.stringify(response.data.totalFee));
        localStorage.setItem(
          "resident",
          JSON.stringify(response.data.resident)
        );
        localStorage.setItem(
          "months",
          JSON.stringify(response.data.numberOfMonths)
        );
        navigate("/dashboard/resident/invoice");
      } else {
        console.error("Failed to generate fee slip:", response.data.message);
      }
    } catch (error) {
      console.error("Error generating fee slip:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = residents.slice(firstIndex, lastIndex);
  const npage = Math.ceil(residents.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  return (
    <main className="main-container text-center">
      <div className="header-left d-flex mb-4">
        <form action="post" className="mx-2 rounded w-100">
          <input
            placeholder="Search for residents"
            type="text"
            className="input mx-2 py-2"
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "2px solid #009843",
            }}
          />
        </form>
      </div>

      <h1 className="mx-5 mt-3 ">Resident Table</h1>

      <div
        className="my-3 py-3"
        style={{
          backgroundColor: "#263043",
          borderRadius: "12px",
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        }}
      >
        <h3 className="mb-3">FILTERS</h3>
        <label className="mx-2 d-inline">
          <input
            type="checkbox"
            className="mx-2"
            checked={showUnpaidOnly}
            onChange={(e) => setShowUnpaidOnly(e.target.checked)}
          />
          Unpaid Residents
        </label>
        <label className="mx-2 d-inline">
          <input
            type="checkbox"
            className="mx-2"
            checked={showTanentsOnly}
            onChange={(e) => {
              setShowTanentsOnly(e.target.checked);
            }}
          />
          Tanents
        </label>
      </div>
      <div className="main-table w-100 table-responsive mt-2 ">
        <table className="table table-dark table-hover rounded">
          <thead className="bg-light border">
            <tr className="text-center">
              <th scope="col">Full Name</th>
              {!showTanentsOnly && <th scope="col">Email</th>}
              <th scope="col">Phone</th>
              <th scope="col">House Number</th>
              <th scope="col">CNIC</th>
              {!showTanentsOnly && <th scope="col">Payment Status</th>}
              {!showTanentsOnly && <th scope="col">Payment Slip</th>}
              {!showTanentsOnly && <th scope="col">Action</th>}
              {showTanentsOnly && <th scope="col">NOC</th>}
            </tr>
          </thead>
          {!residents && (
            <Audio
              height="60"
              width="50"
              radius="9"
              color="rgba(255, 255, 255, 0.2)"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          )}
          <tbody>
            {records
              .filter((item) => {
                // Log the item to check its structure

                const matchesSearch =
                  search.toLowerCase() === "" ||
                  item.FullName.toLowerCase().includes(search) ||
                  item.Email.toLowerCase().includes(search) ||
                  item.Phone.toLowerCase().includes(search) ||
                  item.HouseNumber.toLowerCase().includes(search) ||
                  item.CNIC.toLowerCase().includes(search);

                const matchesUnpaid = !showUnpaidOnly || !item.paid;

                return matchesSearch && matchesUnpaid;
              })
              .flatMap((r) => {
                // Log the tenant data to check its structure

                if (showTanentsOnly) {
                  const validTenants = r.tanents.filter(
                    (tenant) => tenant.name.length > 1
                  );

                  // Log the filtered tenants

                  return validTenants.length > 0
                    ? validTenants.map((tenant) => (
                        <tr
                          key={tenant._id || Math.random()}
                          className="text-center align-middle"
                        >
                          <td>{tenant.name || "N/A"}</td>

                          <td>{tenant.number || "N/A"}</td>
                          <td>{r.HouseNumber}</td>
                          <td>{tenant.cnic || "N/A"}</td>
                          <td>{tenant.nocNo || "N/A"}</td>
                        </tr>
                      ))
                    : [];
                } else {
                  return (
                    <tr
                      key={r._id}
                      className="text-center align-middle"
                      // onClick={() => navigate(`/dashboard/resident/${r._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{r.FullName}</td>
                      <td>{r.Email}</td>
                      <td>{r.Phone}</td>
                      <td>{r.HouseNumber}</td>
                      <td>{r.CNIC}</td>
                      <td style={{ color: r.paid ? "green" : "red" }}>
                        {r.paid ? "Paid" : "Unpaid"}
                      </td>
                      <td>
                        <select
                          onChange={(e) => setNumberOfMonths(e.target.value)}
                          className="form-select fs-6"
                        >
                          <option>Months</option>
                          <option value="1">1 Month</option>
                          <option value="2">2 Months</option>
                          <option value="6">6 Months</option>
                          <option value="12">1 year</option>
                        </select>
                        <button
                          className={
                            !r.paid
                              ? "btn btn-outline-info m-1"
                              : "btn btn-outline-secondary m-1 disabled"
                          }
                          onClick={() => generateFeeSlip(r._id)}
                        >
                          Generate
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger "
                          onClick={() => {
                            if (confirm("Are you sure you want to delete?")) {
                              handleDelete(r._id);
                            }
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-info m-1"
                          onClick={() =>
                            navigate(`/dashboard/resident/${r._id}`)
                          }
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={prevPage}
                style={{ color: "rgb(3, 187, 80)" }}
              >
                Prev
              </a>
            </li>
            {numbers.map((n, i) => (
              <li
                className={`page-item-dark ${
                  currentPage === n ? "active" : ""
                }`}
                key={i}
              >
                <a
                  href="#"
                  className="page-link border-none"
                  onClick={() => changeCPage(n)}
                  style={{
                    backgroundColor: "rgb(3, 187, 80)",
                    border: "1px solid #009843",
                  }}
                >
                  {n}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={nextPage}
                style={{ color: "rgb(3, 187, 80)" }}
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
};

export default ResidentTable;
