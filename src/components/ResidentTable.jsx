import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResidentTable = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  console.log(search);

  const allResidents = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/v1/resident/getResidents"
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
        `http://localhost:4000/api/v1/resident/deleteResident/${id}`
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

  const searchHandler = (e) => {
    e.preventDefault();
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
