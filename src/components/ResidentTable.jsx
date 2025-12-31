import axios from 'axios';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Audio } from 'react-loader-spinner';
import { ToastContainer } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

const ResidentTable = () => {
  const backendURL = 'https://directory-management-g8gf.onrender.com';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDates, setSelectedDates] = useState({});
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [showTenantsOnly, setShowTenantsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentId, setResidentId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [houseSearch, setHouseSearch] = useState('');
  const [activeDatePickerId, setActiveDatePickerId] = useState(null);

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
        // Initialize selectedDates for each resident
        setSelectedDates(
          res.data.residents.reduce((acc, resident) => {
            acc[resident._id] = {
              start: moment().subtract(1, 'months').toDate(),
              end: moment().toDate(),
            };
            return acc;
          }, {})
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching residents');
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
        toast.error(res?.data?.message || 'Failed to delete resident');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting resident');
    } finally {
      setLoading(false);
    }
  };

  const Slippopup = (id) => {
    setIsOpen(true);
    setResidentId(id);
    setActiveDatePickerId(null); // Close any open date picker when opening modal
  };

  const generateFeeSlip = async (residentId, paymentMode) => {
    setLoading(true);
    const { start, end } = selectedDates[residentId] || {};
    let months = [];

    if (start && end) {
      const startDate = moment(start);
      const endDate = moment(end);

      // Ensure start date is not after end date
      if (startDate.isAfter(endDate)) {
        toast.warn('Start date cannot be after end date');
        setLoading(false);
        return;
      }

      // Generate array of months between start and end dates
      const current = startDate.clone().startOf('month');
      while (current.isSameOrBefore(endDate, 'month')) {
        months.push(current.format('YYYY-MM'));
        current.add(1, 'month');
      }
    }

    const numberOfMonths = months.length;

    if (numberOfMonths === 0) {
      toast.warn('Please select valid start and end dates');
      setLoading(false);
      return;
    }

    localStorage.setItem('PaymentMode', paymentMode);
    localStorage.setItem('NumberOfMonths', JSON.stringify(months));

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
        localStorage.setItem('amount', JSON.stringify(response.data.totalFee));
        localStorage.setItem(
          'resident',
          JSON.stringify(response.data.resident)
        );
        localStorage.setItem('months', JSON.stringify(months));
        setIsOpen(false);
        navigate('/dashboard/resident/invoice');
      } else {
        toast.error(response.data.message || 'Failed to generate fee slip');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating fee slip');
    } finally {
      setLoading(false);
    }
  };
  const exportToExcel = () => {
    if (!filteredResidents.length) {
      toast.warn('No resident data to export');
      return;
    }

    // Prepare data for export
    const exportData = filteredResidents.map((r, index) => ({
      'S.No': index + 1,
      'Full Name': r.FullName || 'N/A',
      Email: r.Email || 'N/A',
      Phone: r.Phone || 'N/A',
      'House Number': r.HouseNumber || 'N/A',
      CNIC: r.CNIC || 'N/A',
      'Resident Type': r.residentType || 'N/A',
      'Payment Status': r.paid ? 'Paid' : 'Unpaid',
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Residents');

    // Apply column widths (optional, for readability)
    const colWidths = [
      { wch: 5 }, // S.No
      { wch: 25 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // House Number
      { wch: 20 }, // CNIC
      { wch: 12 }, // Resident Type
      { wch: 12 }, // Payment Status
    ];
    worksheet['!cols'] = colWidths;

    // Generate and save Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Residents_${moment().format('YYYY-MM-DD_HH-mm')}.xlsx`);
  };

  const filteredResidents = useMemo(() => {
    if (showTenantsOnly) {
      return residents.filter(
        (item) => (item.residentType || '').toLowerCase() === 'tenant'
      );
    }
    return residents.filter((item) => {
      const houseMatch =
        houseSearch.trim() === '' ||
        (item.HouseNumber || '')
          .toLowerCase()
          .includes(houseSearch.toLowerCase());
      const generalMatch =
        search.trim() === '' ||
        (item.FullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.Email || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.Phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.CNIC || '').toLowerCase().includes(search.toLowerCase());
      const matchesUnpaid = !showUnpaidOnly || !item.paid;
      return houseMatch && generalMatch && matchesUnpaid;
    });
  }, [residents, search, houseSearch, showUnpaidOnly, showTenantsOnly]);

  const toggleDatePicker = (id) => {
    setActiveDatePickerId(activeDatePickerId === id ? null : id);
  };

  return (
    <main className="main-container">
      <div className="container-fluid px-4">
        <h1 className="mb-4 mt-3 text-center" style={{ color: '#111827', fontWeight: 700 }}>Resident Table</h1>

        <div
          className="mb-4 p-4"
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>Search Residents</label>
              <input
                placeholder="Name, Email, Phone, CNIC..."
                type="text"
                className="form-control"
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>House Number</label>
              <input
                value={houseSearch}
                placeholder="Search by House #"
                type="text"
                className="form-control"
                onChange={(e) => setHouseSearch(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
            <div className="col-md-5 d-flex align-items-center justify-content-between">
              <div className="d-flex gap-4">
                <label className="d-flex align-items-center gap-2 cursor-pointer" style={{ color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showUnpaidOnly}
                    onChange={(e) => setShowUnpaidOnly(e.target.checked)}
                    style={{ accentColor: '#03bb50', width: '1.2rem', height: '1.2rem' }}
                  />
                  <span className="fw-medium">Unpaid Only</span>
                </label>
                <label className="d-flex align-items-center gap-2 cursor-pointer" style={{ color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showTenantsOnly}
                    onChange={(e) => setShowTenantsOnly(e.target.checked)}
                    style={{ accentColor: '#03bb50', width: '1.2rem', height: '1.2rem' }}
                  />
                  <span className="fw-medium">Tenants Only</span>
                </label>
              </div>
              <div className="text-end">
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill" style={{ fontSize: '0.9rem', backgroundColor: '#dcfce7', color: '#166534' }}>
                  Total: {filteredResidents.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-end my-3 mx-2">
          <button
            className="btn"
            onClick={exportToExcel}
            style={{
              backgroundColor: '#03bb50',
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontWeight: 500,
              border: 'none'
            }}
          >
            Export to Excel
          </button>
        </div>
        <div className="main-table w-100 table-responsive mt-2">
          <table className="table table-hover rounded" style={{ backgroundColor: 'white' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr className="text-center align-middle">
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  House Number
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  CNIC
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Payment Status
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
                >
                  Payment Slip
                </th>
                <th
                  scope="col"
                  className="py-3 fs-6"
                  style={{ color: '#111827', fontWeight: 600 }}
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
                        color="#242424"
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
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#374151'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>{r.FullName || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{r.Email || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{r.Phone || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{r.HouseNumber || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{r.CNIC || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{r.residentType || 'N/A'}</td>
                    <td style={{ color: r.paid ? '#03bb50' : '#ef4444', fontWeight: 600, padding: '1rem' }}>
                      {r.paid ? 'Paid' : 'Unpaid'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        className="btn m-1"
                        onClick={() => Slippopup(r._id)}
                        disabled={r.paid}
                        style={{
                          backgroundColor: r.paid ? '#e5e7eb' : '#03bb50',
                          color: r.paid ? '#9ca3af' : 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Generate
                      </button>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex flex-nowrap">
                        <button
                          className="btn m-1"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete?')) {
                              handleDelete(r._id);
                            }
                          }}
                          title="Delete"
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn m-1"
                          onClick={() => navigate(`/dashboard/resident/${r._id}`)}
                          title="Details"
                          style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className="btn m-1"
                          onClick={() =>
                            navigate(`/dashboard/update-resident/${r._id}`)
                          }
                          title="Edit"
                          style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isOpen && (
          <div className="popup-overlay">
            <div className="popup-content bg-white p-4 rounded shadow text-dark" style={{ minWidth: '400px' }}>
              {loading && (
                <div className="d-flex justify-content-center my-3">
                  <Audio
                    height="60"
                    width="50"
                    radius="9"
                    color="#03bb50"
                    ariaLabel="loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
              <h4 style={{ color: '#111827', fontWeight: 600, marginBottom: '1.5rem' }}>Generate Fee Slip</h4>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Start Month</label>
                <DatePicker
                  selected={selectedDates[residentId]?.start || null}
                  onChange={(date) => {
                    const newStart = date;
                    const newEnd =
                      selectedDates[residentId]?.end || moment().toDate();
                    if (
                      newStart &&
                      newEnd &&
                      moment(newStart).isAfter(moment(newEnd))
                    ) {
                      toast.warn('Start date cannot be after end date');
                      return;
                    }
                    setSelectedDates({
                      ...selectedDates,
                      [residentId]: {
                        ...selectedDates[residentId],
                        start: newStart,
                      },
                    });
                  }}
                  minDate={new Date('2000-01-01')}
                  // Removed maxDate restriction to allow future dates
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="form-control"
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                  open={activeDatePickerId === `${residentId}-start`}
                  onFocus={() => setActiveDatePickerId(`${residentId}-start`)}
                  onClickOutside={() => setActiveDatePickerId(null)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">End Month</label>
                <DatePicker
                  selected={selectedDates[residentId]?.end || null}
                  onChange={(date) => {
                    const newEnd = date;
                    const newStart =
                      selectedDates[residentId]?.start ||
                      moment().subtract(1, 'months').toDate();
                    if (
                      newEnd &&
                      newStart &&
                      moment(newEnd).isBefore(moment(newStart))
                    ) {
                      toast.warn('End date cannot be before start date');
                      return;
                    }
                    setSelectedDates({
                      ...selectedDates,
                      [residentId]: {
                        ...selectedDates[residentId],
                        end: newEnd,
                      },
                    });
                  }}
                  minDate={new Date('2000-01-01')}
                  // Removed maxDate restriction to allow future dates
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="form-control"
                  open={activeDatePickerId === `${residentId}-end`}
                  onFocus={() => setActiveDatePickerId(`${residentId}-end`)}
                  onClickOutside={() => setActiveDatePickerId(null)}
                />
              </div>
              <p className="mb-3">
                Selected period:{' '}
                <strong>
                  {selectedDates[residentId]?.start &&
                    selectedDates[residentId]?.end
                    ? `${moment(selectedDates[residentId].start).format(
                      'MMMM YYYY'
                    )} - ${moment(selectedDates[residentId].end).format(
                      'MMMM YYYY'
                    )}`
                    : 'None selected'}
                </strong>
                <br />
                Total months:{' '}
                <strong>
                  {selectedDates[residentId]?.start &&
                    selectedDates[residentId]?.end
                    ? moment(selectedDates[residentId].end).diff(
                      moment(selectedDates[residentId].start),
                      'months'
                    ) + 1
                    : 0}
                </strong>
              </p>
              <div className="d-flex justify-content-end">
                <button
                  className="btn mx-2"
                  onClick={() => generateFeeSlip(residentId, 'IBFT')}
                  style={{
                    backgroundColor: '#03bb50',
                    color: 'white',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    border: 'none'
                  }}
                >
                  IBFT
                </button>
                <button
                  className="btn mx-2"
                  onClick={() => generateFeeSlip(residentId, 'Cash')}
                  style={{
                    backgroundColor: '#03bb50',
                    color: 'white',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    border: 'none'
                  }}
                >
                  Cash
                </button>
                <button
                  className="btn mx-2"
                  onClick={() => setIsOpen(false)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    border: '1px solid #d1d5db'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </main>
  );
};

export default ResidentTable;
