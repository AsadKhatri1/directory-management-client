import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResidentTable = () => {
  const [residents, setResidents] = useState([]);

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
  return (
    <main className="main-container">
      <h2 className="mx-5 mt-3 text-white">Resident Table</h2>
      <div className="main-table w-100 table-responsive mt-4">
        <table className="table table-dark table-bordered table-hover">
          <thead className="bg-light">
            <tr className="text-center">
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">House Number</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((r, i) => (
              <tr key={r._id} className="text-center align-middle">
                <td>{r.FullName}</td>
                <td>{r.Email}</td>
                <td>{r.Phone}</td>
                <td>{r.HouseNumber}</td>
                <td>
                  <button
                    className="btn btn-outline-danger m-1"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                  <button className="btn btn-outline-warning m-1">
                    Update
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
