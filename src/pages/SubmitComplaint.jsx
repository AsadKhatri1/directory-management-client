import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const SubmitComplaint = () => {
    const [complaint, setComplaint] = useState({
        full_name: '',
        email: '',
        phone: '',
        title: '',
        description: '',
        category: '',
        attachment_url: '',
    });

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const baseUrl = "https://directory-management-g8gf.onrender.com/api/v1";

    const categories = [
        'Noise Complaint',
        'Security Concern',
        'Maintenance Issue',
        'Parking Dispute',
        'Waste Management',
        'Other',
    ];

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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const uploadedUrl = await uploadFileToCloudinary(file);
            setComplaint((prev) => ({ ...prev, attachment_url: uploadedUrl }));
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complaint.full_name || !complaint.email || !complaint.title || !complaint.description || !complaint.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${baseUrl}/complaint/submit`, complaint);
            if (res.data.success) {
                toast.success('Complaint Submitted Successfully');
                setComplaint({
                    full_name: '',
                    email: '',
                    phone: '',
                    title: '',
                    description: '',
                    category: '',
                    attachment_url: '',
                });
            } else {
                toast.error('Error submitting complaint');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving complaint');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <Card title="Submit a Complaint" subtitle="Please fill out the form below to voice your concern.">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <Input
                                    label="Full Name"
                                    required
                                    placeholder="John Doe"
                                    value={complaint.full_name}
                                    onChange={(e) => setComplaint({ ...complaint, full_name: e.target.value })}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-3">
                                <Input
                                    label="Email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={complaint.email}
                                    onChange={(e) => setComplaint({ ...complaint, email: e.target.value })}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-3">
                                <Input
                                    label="Phone Number"
                                    placeholder="(123) 456-7890"
                                    value={complaint.phone}
                                    onChange={(e) => setComplaint({ ...complaint, phone: e.target.value })}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-3">
                                <label className="ui-input-label">Category <span className="ui-input-required">*</span></label>
                                <select
                                    className="form-control"
                                    style={{
                                        background: "white",
                                        color: "#111827",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        padding: "0.75rem",
                                        width: '100%'
                                    }}
                                    value={complaint.category}
                                    onChange={(e) => setComplaint({ ...complaint, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <Input
                                    label="Complaint Title"
                                    required
                                    placeholder="Brief summary of the issue"
                                    value={complaint.title}
                                    onChange={(e) => setComplaint({ ...complaint, title: e.target.value })}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-3">
                                <label className="ui-input-label">Description <span className="ui-input-required">*</span></label>
                                <textarea
                                    className="form-control"
                                    style={{
                                        background: "white",
                                        color: "#111827",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        padding: "0.75rem",
                                        width: '100%'
                                    }}
                                    placeholder="Provide detailed information about your complaint"
                                    rows="4"
                                    value={complaint.description}
                                    onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="ui-input-label">Attachment (Optional)</label>
                                <label className={`btn btn-outline-${complaint.attachment_url ? 'success' : 'primary'} w-100 py-3`} style={{ borderRadius: '8px' }}>
                                    {complaint.attachment_url
                                        ? 'File Uploaded ✅'
                                        : uploading
                                            ? 'Uploading...'
                                            : 'Choose File'}
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        hidden
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={loading}
                                disabled={uploading}
                            >
                                Submit Complaint
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SubmitComplaint;
