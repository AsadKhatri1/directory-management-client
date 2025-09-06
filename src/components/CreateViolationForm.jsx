import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateViolationForm = ({ baseUrl, onSuccess, onCancel }) => {
  const [newViolation, setNewViolation] = useState({
    HouseNo: '',
    Resident: '',
    Title: '',
    Description: '',
    Status: 'new',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);

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

  const handleViolationPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadFileToCloudinary(file);
      setNewViolation((prev) => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (error) {
      console.error('Error uploading violation photo:', error);
      toast.error('Error uploading photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddViolation = async () => {
    try {
      const res = await axios.post(`${baseUrl}/violation/save`, newViolation);
      if (res.data.success) {
        toast.success('Violation Added Successfully');
        if (onSuccess) onSuccess(); // notify parent
        setNewViolation({
          HouseNo: '',
          Resident: '',
          Title: '',
          Description: '',
          Status: 'new',
          imageUrl: '',
        });
      } else {
        toast.error('Error In Creating A Violation');
      }
    } catch (error) {
      toast.error('Error saving violation');
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-dark text-light rounded">
      <div className="mb-3">
        <label className="form-label">House Number</label>
        <input
          className="form-control bg-secondary text-light"
          placeholder="House Number"
          value={newViolation.HouseNo}
          onChange={(e) =>
            setNewViolation({ ...newViolation, HouseNo: e.target.value })
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
            setNewViolation({ ...newViolation, Resident: e.target.value })
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
            setNewViolation({ ...newViolation, Title: e.target.value })
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
            setNewViolation({ ...newViolation, Description: e.target.value })
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
          <div className="mt-2 text-success small">Image ready to save ✅</div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-success me-2"
          onClick={handleAddViolation}
          disabled={uploading}
        >
          Save Violation
        </button>
        {onCancel && (
          <button className="btn btn-outline-light" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateViolationForm;
