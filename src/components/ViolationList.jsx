import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ViolationList = () => {
  const [baseUrl, setBaseUrl] = useState('http://localhost:4000/api/v1');
  const [violations, setViolations] = useState([
    // {
    //   id: 1,
    //   houseNumber: '101',
    //   residentName: 'John Doe',
    //   title: 'Loud Music',
    //   description: 'Playing loud music past midnight',
    //   status: 'Open',
    //   imageUrl: 'https://via.placeholder.com/80',
    // },
    // {
    //   id: 2,
    //   houseNumber: '202',
    //   residentName: '',
    //   title: 'Improper Parking',
    //   description: 'Car parked outside the designated area',
    //   status: 'Resolved',
    //   imageUrl: 'https://via.placeholder.com/80',
    // },
  ]);

  const [statusFilter, setStatusFilter] = useState('');

  const getViolations = async () => {
    try {
      let url = `${baseUrl}/violation/list`;
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      const res = await axios.get(url);
      setViolations(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching violations:', error);
      toast.error('Failed to fetch violations');
    }
  };

  useEffect(() => {
    getViolations();
  }, [statusFilter]); // 👈 refetch when filter changes

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

  // For image preview modal
  const [previewImage, setPreviewImage] = useState(null);

  const handleAddViolation = async () => {
    // setViolations([
    //   ...violations,
    //   { id: violations.length + 1, ...newViolation },
    // ]);

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
  };

  const handleViolationPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadFileToCloudinary(file);
      setNewViolation((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));
    } catch (error) {
      console.error('Error uploading violation photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const deleted = await axios.delete(`${baseUrl}/violation/${id}`);
    console.log(deleted);
    if (deleted?.data?.success) {
      await getViolations();
      toast.success('Deleted Successfully');
    } else {
      toast.error('Error In Deleting');
    }
  };
  return (
    <main className="main-container text-center">
      {/* Top Controls */}

      <div className="header-left d-flex mb-4 justify-content-between align-items-center">
        <form className="mx-2 rounded w-50">
          <input
            placeholder="Search for violations"
            type="text"
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
            {violations.map((v) => (
              <tr key={v.id} className="text-center align-middle">
                <td>{v.HouseNo}</td>
                <td>{v.Resident || <i className="text-muted">N/A</i>}</td>
                <td>{v.Title}</td>
                <td>{v.Description}</td>
                {/* <td
                  style={{
                    color: v.Status === 'open' || 'new' ? 'red' : 'green',
                  }}
                >
                  {v.Status}
                </td> */}
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
                    {/* Options stay white (default browser styling) */}
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
                  {new Date(v.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })}
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

              {/* Body */}
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">House Number</label>
                  <input
                    className="form-control bg-secondary text-light"
                    placeholder="House Number"
                    value={newViolation.HouseNo}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        HouseNo: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Resident Name (optional)</label>
                  <input
                    className="form-control bg-secondary text-light"
                    placeholder="Resident Name"
                    value={newViolation.Resident}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        Resident: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control bg-secondary text-light"
                    placeholder="Title"
                    value={newViolation.Title}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        Title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control bg-secondary text-light"
                    placeholder="Description"
                    rows="3"
                    value={newViolation.Description}
                    onChange={(e) =>
                      setNewViolation({
                        ...newViolation,
                        Description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <label className="btn btn-outline-light w-100">
                    {newViolation.imageUrl
                      ? 'Image Uploaded'
                      : uploading
                      ? 'Uploading...'
                      : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleViolationPhotoUpload}
                      hidden
                    />
                  </label>
                  {newViolation.imageUrl && (
                    <div className="mt-2 text-success small">
                      Image ready to save ✅
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-secondary">
                <button
                  className="btn btn-success"
                  onClick={handleAddViolation}
                  disabled={uploading}
                >
                  Save Violation
                </button>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
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
