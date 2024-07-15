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
  // Function to execute after 4 seconds

  // Start the timer

  // Optional: You can clear the timer if needed before it finishes
  // clearTimeout(timerId);

  const allResidents = async () => {
    const res = await axios.get(
      "https://directory-management-g8gf.onrender.com/api/v1/resident/getResidents"
    );
    if (res?.data?.success) {
      setResidents(res.data.residents);
    }
    try {
    } catch (err) {
      toast(err.response?.data?.message);
    }
  };
  useEffect(() => {
    allResidents();
  }, []);

  //   deleting a resident
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
  // search handler

  // const searchHandler = (e) => {
  //   e.preventDefault();
  // };

  // Function to handle fee slip generation

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
        console.log(
          `Fee slip generated successfully for ${numberOfMonths}:`,
          response.data.totalFee,
          response.data.resident
        );
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
        // Optionally, show a success message or perform other actions
      } else {
        console.error("Failed to generate fee slip:", response.data.message);
        // Show an error message or handle the error in a suitable way
      }
    } catch (error) {
      console.error("Error generating fee slip:", error);
      // Show an error message or handle the error in a suitable way
    }
  };

  // pagination work below
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
      <div className="header-left d-flex   mb-4">
        <form action="post" className="mx-2 rounded w-100 ">
          <input
            placeholder="Search for residents"
            type="text"
            className=" input mx-2 py-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <h1 className="mx-5 mt-4 mb-2 ">Resident Table</h1>
      <div className="main-table w-100 table-responsive mt-5">
        <table className="table table-dark table-bordered table-hover">
          <thead className="bg-light">
            <tr className="text-center">
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">House Number</th>
              <th scope="col">CNIC</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Payment Slip</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          {residents.length < 1 && (
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
                return search.toLowerCase() === ""
                  ? item
                  : item.FullName.toLowerCase().includes(search) ||
                      item.Email.toLowerCase().includes(search) ||
                      item.Phone.toLowerCase().includes(search) ||
                      item.HouseNumber.toLowerCase().includes(search) ||
                      item.CNIC.toLowerCase().includes(search);
              })
              .map((r, i) => (
                <tr key={r._id} className="text-center align-middle">
                  <td>{r.FullName}</td>
                  <td>{r.Email}</td>
                  <td>{r.Phone}</td>
                  <td>{r.HouseNumber}</td>
                  <td>{r.CNIC}</td>
                  <td style={{ color: r.paid ? "green" : "red" }}>
                    {r.paid ? "paid" : "Unpaid"}
                  </td>
                  <td>
                    <select
                      // value={numberOfMonths}
                      onChange={(e) => setNumberOfMonths(e.target.value)}
                      className="form-select my-1"
                    >
                      <option>Select months</option>
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">1 year</option>
                      {/* Add more options for different durations if needed */}
                    </select>
                    <button
                      className={
                        !r.paid
                          ? "btn btn-outline-info m-1"
                          : "btn btn-outline-secondary m-1 disabled"
                      }
                      onClick={() => generateFeeSlip(r._id)}
                    >
                      Generate Fee Slip
                    </button>
                    {/* Other action buttons */}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger m-1"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-info m-1"
                      onClick={() => navigate(`/dashboard/resident/${r._id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" onClick={prevPage}>
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
                  className="page-link"
                  onClick={() => changeCPage(n)}
                >
                  {n}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="#" onClick={nextPage}>
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
