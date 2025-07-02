import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import { ToastContainer } from "react-bootstrap";
import moment from "moment";

const ResidentTable = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonths, setSelectedMonths] = useState({});
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [showTenantsOnly, setShowTenantsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentId, setResidentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [houseSearch, setHouseSearch] = useState("");

  // Generate a list of months from 12 months prior to 12 months after the current date
  const monthsOptions = Array.from({ length: 24 }, (_, i) => {
    const date = moment().subtract(12, "months").add(i, "months");
    return {
      value: date.format("YYYY-MM"),
      label: date.format("MMMM YYYY"),
    };
  });

  const allResidents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendURL}/api/v1/resident/getResidents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.success) {
        setResidents(res.data.residents);
        // Initialize selectedMonths for each resident
        setSelectedMonths(
          res.data.residents.reduce((acc, resident) => {
            acc[resident._id] = [];
            return acc;
          }, {})
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching residents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allResidents();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${backendURL}/api/v1/resident/deleteResident/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        allResidents();
      } else {
        toast.error(res?.data?.message || "Failed to delete resident");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting resident");
    } finally {
      setLoading(false);
    }
  };

  const Slippopup = (id) => {
    setIsOpen(true);
    setResidentId(id);
  };

  const generateFeeSlip = async (residentId, paymentMode) => {
    setLoading(true);
    const months = selectedMonths[residentId] || [];
    const numberOfMonths = months.length;

    localStorage.setItem("PaymentMode", paymentMode);
    localStorage.setItem("NumberOfMonths", JSON.stringify(months));

    if (numberOfMonths === 0) {
      toast.warn("Please select at least one month to generate slip");
      setLoading(false);
      setIsOpen(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/v1/resident/generateSlip/${residentId}`,
        { numberOfMonths },
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
        localStorage.setItem("months", JSON.stringify(months));
        navigate("/dashboard/resident/invoice");
      } else {
        toast.error(response.data.message || "Failed to generate fee slip");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error generating fee slip");
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = useMemo(() => {
    if (showTenantsOnly) {
      return residents.filter(
        (item) => (item.residentType || "").toLowerCase() === "tenant"
      );
    }
    return residents.filter((item) => {
      const houseMatch =
        houseSearch.trim() === "" ||
        (item.HouseNumber || "")
          .toLowerCase()
          .includes(houseSearch.toLowerCase());
      const generalMatch =
        search.trim() === "" ||
        (item.FullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.Email || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.Phone || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.CNIC || "").toLowerCase().includes(search.toLowerCase());
      const matchesUnpaid = !showUnpaidOnly || !item.paid;
      return houseMatch && generalMatch && matchesUnpaid;
    });
  }, [residents, search, houseSearch, showUnpaidOnly, showTenantsOnly]);

  return (
    <main className="main-container text-center">
      <div className="header-left d-flex mb-4">
        <form action="post" className="mx-2 rounded w-100 d-flex gap-2">
          <input
            placeholder="Search for residents"
            type="text"
            className="input mx-2 py-2"
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "2px solid #009843" }}
          />
          <input
            value={houseSearch}
            placeholder="Search by House Number"
            type="text"
            className="input py-2"
            onChange={(e) => setHouseSearch(e.target.value)}
            style={{ border: "2px solid #0d6efd" }}
          />
        </form>
      </div>

      <h1 className="mx-5 mt-3">Resident Table</h1>

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
            checked={showTenantsOnly}
            onChange={(e) => setShowTenantsOnly(e.target.checked)}
          />
          Tenants
        </label>
        <p style={{ color: "#03bb50", fontSize: "1.24em", padding: "12px" }}>
          Total Residents: {filteredResidents.length}
        </p>
      </div>

      <div className="main-table w-100 table-responsive mt-2">
        <table className="table table-dark table-hover rounded table-striped">
          <thead className="bg-light">
            <tr className="text-center align-middle">
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Full Name
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Email
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Phone
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                House Number
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                CNIC
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Type
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Payment Status
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Payment Slip
              </th>
              <th
                scope="col"
                className="py-3 fs-6"
                style={{ color: "#03bb50" }}
              >
                Action
              </th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={9} className="text-center">
                  <div className="d-flex justify-content-center my-3">
                    <Audio
                      height="60"
                      width="50"
                      radius="9"
                      color="rgba(255, 255, 0.2)"
                      ariaLabel="loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          <tbody>
            {!loading &&
              filteredResidents.map((r) => (
                <tr
                  key={r._id}
                  className="text-center align-middle"
                  style={{ cursor: "pointer" }}
                >
                  <td>{r.FullName || "N/A"}</td>
                  <td>{r.Email || "N/A"}</td>
                  <td>{r.Phone || "N/A"}</td>
                  <td>{r.HouseNumber || "N/A"}</td>
                  <td>{r.CNIC || "N/A"}</td>
                  <td>{r.residentType || "N/A"}</td>
                  <td style={{ color: r.paid ? "green" : "red" }}>
                    {r.paid ? "Paid" : "Unpaid"}
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-info dropdown-toggle fs-6"
                        type="button"
                        id={`monthsDropdown-${r._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Select Months
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`monthsDropdown-${r._id}`}
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {monthsOptions.map((month) => (
                          <li key={month.value}>
                            <label className="dropdown-item">
                              <input
                                type="checkbox"
                                value={month.value}
                                checked={(selectedMonths[r._id] || []).includes(
                                  month.value
                                )}
                                onChange={(e) => {
                                  const months = selectedMonths[r._id] || [];
                                  if (e.target.checked) {
                                    setSelectedMonths({
                                      ...selectedMonths,
                                      [r._id]: [...months, month.value],
                                    });
                                  } else {
                                    setSelectedMonths({
                                      ...selectedMonths,
                                      [r._id]: months.filter(
                                        (m) => m !== month.value
                                      ),
                                    });
                                  }
                                }}
                              />
                              <span className="ms-2">{month.label}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className={
                        !r.paid
                          ? "btn btn-outline-info m-1"
                          : "btn btn-outline-secondary m-1 disabled"
                      }
                      onClick={() => Slippopup(r._id)}
                    >
                      Generate
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger"
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
                      onClick={() => navigate(`/dashboard/resident/${r._id}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-outline-info m-1"
                      onClick={() =>
                        navigate(`/dashboard/update-resident/${r._id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content bg-white p-4 rounded shadow text-dark">
            {loading && (
              <div className="d-flex justify-content-center my-3">
                <Audio
                  height="60"
                  width="50"
                  radius="9"
                  color="rgba(0, 0, 0, 0.2)"
                  ariaLabel="loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}
            <h4>Generate Fee Slip</h4>
            <p>
              Confirm generating a slip for{" "}
              <strong>
                {(selectedMonths[residentId] || []).length} month(s)
              </strong>
              :{" "}
              {(selectedMonths[residentId] || [])
                .map((month) => moment(month, "YYYY-MM").format("MMMM YYYY"))
                .join(", ") || "None selected"}
              ?
            </p>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success mx-2"
                onClick={() => generateFeeSlip(residentId, "IBFT")}
              >
                IBFT
              </button>
              <button
                className="btn btn-success mx-2"
                onClick={() => generateFeeSlip(residentId, "Cash")}
              >
                Cash
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </main>
  );
};

export default ResidentTable;
