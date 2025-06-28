import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import { ToastContainer } from "react-bootstrap";

const ResidentTable = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [showTanentsOnly, setShowTanentsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentId, setResidentsId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [houseSearch, setHouseSearch] = useState("");
  let paymentMode = "";
  const allResidents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/v1/resident/getResidents`);
      if (res?.data?.success) {
        setResidents(res.data.residents);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
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
    } finally {
      setLoading(false);
    }
  };

  const Slippopup = async (iD) => {
    setIsOpen(true);
    setResidentsId(iD);
  };

  const generateFeeSlip = async (residentId, paymentMode) => {
    setLoading(true);
    console.log(numberOfMonths);

    localStorage.setItem("PaymentMode", paymentMode);
    localStorage.setItem("NumberOfMonths", numberOfMonths);

    if (numberOfMonths === 0) {
      toast.warn("Please Select Month to Generate Slip");
      setLoading(false);
      setIsOpen(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/v1/resident/generateSlip/${residentId}`,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container text-center">
      <div className="header-left d-flex mb-4">
        <form action="post" className="mx-2 rounded w-100 d-flex gap-2">
          <input
            placeholder="Search for residents"
            type="text"
            className="input mx-2 py-2"
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "2px solid #009843",
            }}
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
            onChange={(e) => setShowTanentsOnly(e.target.checked)}
          />
          Tenants
        </label>
        <p style={{ color: "#03bb50", fontSize: "1.24em", padding: "12px" }}>
          Total Resident : {residents.length}
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
                <td colSpan={8} className="text-center">
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
              residents
                .filter((item) => {
                  const houseMatch =
                    houseSearch.trim() === "" ||
                    item.HouseNumber.toLowerCase().includes(
                      houseSearch.toLowerCase()
                    );

                  const generalMatch =
                    search.trim() === "" ||
                    item.FullName.toLowerCase().includes(
                      search.toLowerCase()
                    ) ||
                    item.Email.toLowerCase().includes(search.toLowerCase()) ||
                    item.Phone.toLowerCase().includes(search.toLowerCase()) ||
                    item.CNIC.toLowerCase().includes(search.toLowerCase());

                  const matchesUnpaid = !showUnpaidOnly || !item.paid;
                  const matchesTenant =
                    !showTanentsOnly || item.residentType === "tanent";

                  return (
                    houseMatch && generalMatch && matchesUnpaid && matchesTenant
                  );
                })
                .map((r) => (
                  <tr
                    key={r._id}
                    className="text-center align-middle"
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
                          navigate(`/dashboard/updateResident/${r._id}`)
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
              Confirm generating a slip for <strong>{numberOfMonths}</strong>{" "}
              month(s)?
            </p>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success mx-2"
                onClick={() => {
                  generateFeeSlip(residentId, "Cheque");
                }}
              >
                Cheque
              </button>
              <button
                className="btn btn-success mx-2"
                onClick={() => {
                  generateFeeSlip(residentId, "Cash");
                }}
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
