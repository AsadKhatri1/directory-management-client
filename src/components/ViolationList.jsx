import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CreateViolationForm from './CreateViolationForm';

const ViolationList = () => {
  const [baseUrl] = useState(
    'https://directory-management-g8gf.onrender.com/api/v1'
  );
  const [violations, setViolations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // ✅ added

  const getViolations = async () => {
    try {
      let url = `${baseUrl}/violation/list`;
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await axios.get(url);
      setViolations(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching violations:', error);
      toast.error('Failed to fetch violations');
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
    <main className="main-container text-center">
      {/* Top Controls */}
      <div className="header-left d-flex mb-4 justify-content-between align-items-center">
        <form className="mx-2 rounded w-50">
          <input
            placeholder="Search for violations"
            type="text"
            value={searchTerm} // ✅ controlled input
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ update search
            className="input mx-2 py-2 w-100"
            style={{ border: '2px solid #009843' }}
          />
        </form>

        <button
          className="btn btn-success mx-3"
          onClick={() => setShowModal(true)}
        >
          Add New Violation
        </button>
      </div>

      <h1 className="mx-5 mt-3">VIOLATIONS</h1>

      <div className="d-flex">
        <select
          className="form-select mx-2 ms-auto"
          style={{ width: '150px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Violations Table */}
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
              <th style={{ color: '#03bb50' }}>House No.</th>
              <th style={{ color: '#03bb50' }}>Resident</th>
              <th style={{ color: '#03bb50' }}>Title</th>
              <th style={{ color: '#03bb50' }}>Description</th>
              <th style={{ color: '#03bb50' }}>Status</th>
              <th style={{ color: '#03bb50' }}>Image</th>
              <th style={{ color: '#03bb50' }}>Date</th>
              <th style={{ color: '#03bb50' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.map((v) => (
              <tr key={v._id} className="text-center align-middle">
                <td>{v.HouseNo}</td>
                <td>{v.Resident || <i className="text-muted">N/A</i>}</td>
                <td>{v.Title}</td>
                <td>{v.Description}</td>
                <td>
                  <select
                    className="form-select form-select-sm bg-dark"
                    style={{
                      color: v.Status === 'resolved' ? 'limegreen' : 'red',
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
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete?')) {
                        handleDelete(v._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredViolations.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No matching violations found
                </td>
              </tr>
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
            <div className="modal-content bg-dark text-light border-secondary">
              {/* Header */}
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Add New Violation</h5>
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
    </main>
  );
};

export default ViolationList;
