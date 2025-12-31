import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Audio } from 'react-loader-spinner';
import CreateViolationForm from './CreateViolationForm';

const ViolationList = () => {
  const [baseUrl] = useState(
    'https://directory-management-g8gf.onrender.com/api/v1'
  );
  const [violations, setViolations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // ✅ added
  const [loading, setLoading] = useState(false); // ✅ added loader state

  const getViolations = async () => {
    try {
      setLoading(true); // ✅ start loading
      let url = `${baseUrl}/violation/list`;
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await axios.get(url);
      setViolations(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching violations:', error);
      toast.error('Failed to fetch violations');
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    getViolations();
  }, [statusFilter]);

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images_preset');
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload',
      { method: 'POST', body: formData }
    );
    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  const [newViolation, setNewViolation] = useState({
    HouseNo: '',
    Resident: '',
    Title: '',
    Description: '',
    Status: 'new',
    imageUrl: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleAddViolation = async () => {
    try {
      const res = await axios.post(`${baseUrl}/violation/save`, newViolation);
      if (res.data.success) {
        setNewViolation({
          HouseNo: '',
          Resident: '',
          Title: '',
          Description: '',
          Status: 'new',
          imageUrl: '',
        });
        await getViolations();
        toast.success('Violation Added Successfully');
        setShowModal(false);
      } else {
        toast.error('Error In Creating A Violation');
      }
    } catch (error) {
      toast.error('Error saving violation');
      console.error(error);
    }
  };

  const handleViolationPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadFileToCloudinary(file);
      setNewViolation((prev) => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (error) {
      console.error('Error uploading violation photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleted = await axios.delete(`${baseUrl}/violation/${id}`);
      if (deleted?.data?.success) {
        await getViolations();
        toast.success('Deleted Successfully');
      } else {
        toast.error('Error In Deleting');
      }
    } catch (error) {
      toast.error('Error deleting violation');
      console.error(error);
    }
  };

  // ✅ filter violations locally by house no or resident
  const filteredViolations = violations.filter((v) => {
    const search = searchTerm.toLowerCase();
    return (
      v.HouseNo?.toLowerCase().includes(search) ||
      v.Resident?.toLowerCase().includes(search)
    );
  });

  return (
    <main className="main-container">
      <div className="container-fluid px-4">
        <h1 className="mb-4 mt-3 text-center" style={{ color: '#111827', fontWeight: 700 }}>Violation Table</h1>

        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
            style={{
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontWeight: 500,
              border: 'none'
            }}
          >
            + Add New Violation
          </button>
        </div>

        {/* Unified Filter Bar */}
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
            <div className="col-md-8">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>Search Violations</label>
              <input
                placeholder="Search by House No or Resident..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.9375rem'
                }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.9375rem'
                }}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Violations Table */}
        <div
          className="main-table w-100 table-responsive mt-3"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          <table className="table table-hover rounded" style={{ backgroundColor: 'white' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr className="text-center align-middle">
                <th style={{ color: '#111827', fontWeight: 600 }}>House No.</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Resident</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Title</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Description</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Status</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Image</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Date</th>
                <th style={{ color: '#111827', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <Audio
                      height="60"
                      width="50"
                      radius="9"
                      color="#03bb50"
                      ariaLabel="loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </td>
                </tr>
              ) : filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No matching violations found
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => (
                  <tr key={v._id} className="text-center align-middle" style={{ borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                    <td>{v.HouseNo}</td>
                    <td>{v.Resident || <i className="text-muted">N/A</i>}</td>
                    <td>{v.Title}</td>
                    <td>{v.Description}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{
                          color: v.Status === 'resolved' ? '#03bb50' : '#ef4444',
                          fontWeight: 600,
                          border: '1px solid #d1d5db'
                        }}
                        value={v.Status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await axios.put(
                              `${baseUrl}/violation/${v._id}`,
                              { Status: newStatus }
                            );
                            if (res.data.success) {
                              toast.success('Status updated');
                              await getViolations();
                            } else {
                              toast.error('Failed to update status');
                            }
                          } catch (error) {
                            toast.error('Error updating status');
                            console.error(error);
                          }
                        }}
                      >
                        <option value="new">new</option>
                        <option value="open">open</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </td>
                    <td>
                      <img
                        src={v.imageUrl}
                        alt={v.Title}
                        className="rounded"
                        width="60"
                        height="60"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setPreviewImage(v.imageUrl)}
                      />
                    </td>
                    <td>
                      {new Date(v.createdAt)
                        .toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        })
                        .replace(',', '')}
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete?')) {
                            handleDelete(v._id);
                          }
                        }}
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          border: '1px solid #fecaca',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Violation Modal */}
        {showModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content bg-white text-dark border">
                {/* Header */}
                <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <h5 className="modal-title" style={{ color: '#111827', fontWeight: 600 }}>Add New Violation</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Body: our CreateViolationForm */}
                <div className="modal-body">
                  <CreateViolationForm
                    baseUrl={baseUrl}
                    onSuccess={async () => {
                      await getViolations();
                      setShowModal(false);
                    }}
                    onCancel={() => setShowModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={() => setPreviewImage(null)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-transparent border-0 text-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-fluid rounded shadow"
                />
                <button
                  className="btn btn-light mt-3"
                  onClick={() => setPreviewImage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ViolationList;
