import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebaropen, setSidebaropen] = useState(false);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [status, setStatus] = useState("");
    const [adminNotes, setAdminNotes] = useState("");

    const backendURL = "https://directory-management-g8gf.onrender.com/api/v1";
    const token = localStorage.getItem("token");

    const sideBarToggle = () => {
        setSidebaropen(!sidebaropen);
    };

    const fetchComplaintDetails = async () => {
        try {
            const res = await axios.get(`${backendURL}/complaint/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setComplaint(res.data.data);
                setStatus(res.data.data.status);
                setAdminNotes(res.data.data.admin_notes || "");
            }
        } catch (error) {
            toast.error("Error fetching complaint details");
            navigate("/dashboard/complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaintDetails();
    }, [id]);

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            // Update Status
            const statusRes = await axios.patch(`${backendURL}/complaint/admin/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update Notes
            const notesRes = await axios.patch(`${backendURL}/complaint/admin/${id}/notes`, { admin_notes: adminNotes }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (statusRes.data.success && notesRes.data.success) {
                toast.success("Complaint updated successfully");
                fetchComplaintDetails();
            }
        } catch (error) {
            toast.error("Error updating complaint");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_PROGRESS': return 'primary';
            case 'RESOLVED': return 'success';
            case 'REJECTED': return 'danger';
            default: return 'default';
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="grid-container">
            <Header openSideBar={sideBarToggle} />
            <Sidebar sideBarToggle={sidebaropen} openSideBar={sideBarToggle} />

            <main className="main-container">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button variant="secondary" onClick={() => navigate("/dashboard/complaints")}>
                            &larr; Back to List
                        </Button>
                        <h2 className="mb-0">Complaint Details</h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <Card title={complaint.title}>
                                <div className="mb-4">
                                    <Badge variant={getStatusVariant(complaint.status)} size="lg">{complaint.status}</Badge>
                                    <span className="ms-3 text-muted">Submitted on: {moment(complaint.createdAt).format("LLLL")}</span>
                                </div>

                                <div className="mb-4">
                                    <h5>Description</h5>
                                    <p className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h5>Resident Information</h5>
                                        <p><strong>Name:</strong> {complaint.full_name}</p>
                                        <p><strong>Email:</strong> {complaint.email}</p>
                                        <p><strong>Phone:</strong> {complaint.phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Category</h5>
                                        <p>{complaint.category}</p>
                                    </div>
                                </div>

                                {complaint.attachment_url && (
                                    <div>
                                        <h5>Attachment</h5>
                                        <div className="mt-2">
                                            {complaint.attachment_url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                                <img src={complaint.attachment_url} alt="Attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                            ) : (
                                                <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                                                    View Attachment
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>

                        <div className="col-lg-4">
                            <Card title="Admin Actions">
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Update Status</label>
                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: '8px' }}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Admin Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Enter resolution details or internal notes..."
                                        style={{ padding: '0.75rem', borderRadius: '8px' }}
                                    ></textarea>
                                </div>

                                <Button
                                    variant="success"
                                    fullWidth
                                    onClick={handleUpdate}
                                    loading={updating}
                                >
                                    Save Changes
                                </Button>
                            </Card>

                            <div className="mt-4 text-muted small px-2">
                                <p>Last Updated: {moment(complaint.updatedAt).format("LLL")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComplaintDetail;
