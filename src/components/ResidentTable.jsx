import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResidentTable = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  const allResidents = async () => {
    const res = await axios.get(
      "https://directory-management.onrender.com/api/v1/resident/getResidents"
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
        `https://directory-management.onrender.com/api/v1/resident/deleteResident/${id}`
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
        `https://directory-management.onrender.com/api/v1/resident/generateSlip/${residentId}`,
        { numberOfMonths: numberOfMonths }
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

  return (
    <main className="main-container text-center">
      <div className="header-left d-flex   mb-4">
        <form action="post" className="mx-2 rounded w-100  ">
          <input
            placeholder="Search for residents"
            type="text"
            className="w-50 input mx-2 py-2"
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <BsSearch
            className="icon"
            onClick={searchHandler}
            style={{ cursor: "pointer" }}
          /> */}
        </form>
      </div>
      <h1 className="mx-5 mt-3 mb-2 text-white">Resident Table</h1>
      <div className="main-table w-100 table-responsive mt-5">
        <table className="table table-dark table-bordered table-hover">
          <thead className="bg-light">
            <tr className="text-center">
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">House Number</th>
              <th scope="col">CNIC</th>
              <th scope="col">Payment Slip</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {residents
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
                  <td>
                    <select
                      value={numberOfMonths}
                      onChange={(e) => setNumberOfMonths(e.target.value)}
                      className="form-select my-1"
                    >
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">1 year</option>
                      {/* Add more options for different durations if needed */}
                    </select>
                    <button
                      className="btn btn-outline-info m-1"
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
      </div>
    </main>
  );
};

export default ResidentTable;
