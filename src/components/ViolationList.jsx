import React, { useState } from 'react';

const ViolationList = () => {
  const [violations, setViolations] = useState([
    {
      id: 1,
      houseNumber: '101',
      residentName: 'John Doe',
      title: 'Loud Music',
      description: 'Playing loud music past midnight',
      status: 'Open',
      imageUrl: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      houseNumber: '202',
      residentName: '',
      title: 'Improper Parking',
      description: 'Car parked outside the designated area',
      status: 'Resolved',
      imageUrl: 'https://via.placeholder.com/80',
    },
    {
      id: 3,
      houseNumber: '303',
      residentName: 'Jane Smith',
      title: 'Garbage Disposal Issue',
      description: 'Garbage not disposed properly',
      status: 'Open',
      imageUrl: 'https://via.placeholder.com/80',
    },
  ]);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredRecords = violations.filter((v) => {
    return (
      v.houseNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.residentName.toLowerCase().includes(search.toLowerCase()) ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.status.toLowerCase().includes(search.toLowerCase())
    );
  });
  const records = filteredRecords.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredRecords.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const handleAddViolation = () => {
    const newViolation = {
      id: violations.length + 1,
      houseNumber: '404',
      residentName: 'New Resident',
      title: 'New Violation',
      description: 'Dummy violation added',
      status: 'Open',
      imageUrl: 'https://via.placeholder.com/80',
    };
    setViolations([...violations, newViolation]);
  };

  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage !== npage) setCurrentPage(currentPage + 1);
  };
  const changeCPage = (id) => setCurrentPage(id);

  return (
    <main className="main-container text-center">
      {/* Top Controls */}
      <div className="header-left d-flex mb-4 justify-content-between align-items-center">
        <form className="mx-2 rounded w-50">
          <input
            placeholder="Search for violations"
            type="text"
            className="input mx-2 py-2 w-100"
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: '2px solid #009843' }}
          />
        </form>
        <button onClick={handleAddViolation} className="btn btn-success mx-3">
          Add New Violation
        </button>
      </div>

      <h1 className="mx-5 mt-3">Violation Table</h1>

      <div
        className="main-table w-100 table-responsive mt-3"
        style={{
          backgroundColor: '#263043',
          borderRadius: '12px',
          boxShadow:
            'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
        }}
      >
        <table className="table table-dark table-hover rounded table-striped">
          <thead className="bg-light">
            <tr className="text-center align-middle">
              <th scope="col" style={{ color: '#03bb50' }}>
                House No.
              </th>
              <th scope="col" style={{ color: '#03bb50' }}>
                Resident
              </th>
              <th scope="col" style={{ color: '#03bb50' }}>
                Title
              </th>
              <th scope="col" style={{ color: '#03bb50' }}>
                Description
              </th>
              <th scope="col" style={{ color: '#03bb50' }}>
                Status
              </th>
              <th scope="col" style={{ color: '#03bb50' }}>
                Image
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((v) => (
              <tr key={v.id} className="text-center align-middle">
                <td>{v.houseNumber}</td>
                <td>{v.residentName || <i className="text-muted">N/A</i>}</td>
                <td>{v.title}</td>
                <td>{v.description}</td>
                <td style={{ color: v.status === 'Open' ? 'red' : 'green' }}>
                  {v.status}
                </td>
                <td>
                  <img
                    src={v.imageUrl}
                    alt={v.title}
                    className="rounded"
                    width="60"
                    height="60"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="#" onClick={prevPage}>
                Prev
              </a>
            </li>
            {numbers.map((n, i) => (
              <li
                className={`page-item ${currentPage === n ? 'active' : ''}`}
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

export default ViolationList;
