import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import moment from "moment";
import Badge from "./ui/Badge";

const ComplaintTable = () => {
    const backendURL = "http://localhost:4000/api/v1"; // Using the pattern from other components or env
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    const categories = [
        'Noise Complaint',
        'Security Concern',
        'Maintenance Issue',
        'Parking Dispute',
        'Waste Management',
        'Other',
    ];

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${backendURL}/complaint/admin/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res?.data?.success) {
                setComplaints(res.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const filteredComplaints = useMemo(() => {
        return complaints.filter((item) => {
            const matchesSearch =
                search.trim() === "" ||
                (item.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (item.email || "").toLowerCase().includes(search.toLowerCase()) ||
                (item.title || "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus = filterStatus === "" || item.status === filterStatus;
            const matchesCategory = filterCategory === "" || item.category === filterCategory;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [complaints, search, filterStatus, filterCategory]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'IN_PROGRESS': return 'primary';
            case 'RESOLVED': return 'success';
            case 'REJECTED': return 'danger';
            default: return 'default';
        }
    };

    return (
        <main className="main-container">
            <div className="container-fluid px-4">
                <h1 className="mb-4 mt-3 text-center" style={{ color: '#000000ff', fontWeight: 700 }}>Complaints Management</h1>

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
                            <label className="form-label fw-semibold" style={{ color: '#374151' }}>Search Complaints</label>
                            <input
                                placeholder="Name, Email, Title..."
                                type="text"
                                className="form-control"
                                value={search}
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
                            <label className="form-label fw-semibold" style={{ color: '#374151' }}>Status</label>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    fontSize: '0.9375rem'
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold" style={{ color: '#374151' }}>Category</label>
                            <select
                                className="form-select"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                style={{
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    fontSize: '0.9375rem'
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 text-end">
                            <Badge variant="success" size="lg" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                                Total: {filteredComplaints.length}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="main-table w-100 table-responsive mt-2">
                    <table className="table table-hover rounded" style={{ backgroundColor: 'white' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                            <tr className="text-center align-middle">
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Date</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Full Name</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Email</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Category</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Title</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Status</th>
                                <th className="py-3 fs-6" style={{ color: '#111827', fontWeight: 600 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <Audio height="60" width="60" color="#03bb50" ariaLabel="loading" />
                                    </td>
                                </tr>
                            ) : filteredComplaints.length > 0 ? (
                                filteredComplaints.map((c) => (
                                    <tr key={c._id} className="text-center align-middle" style={{ borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                                        <td className="py-3">{moment(c.createdAt).format("DD MMM YYYY")}</td>
                                        <td className="py-3">{c.full_name}</td>
                                        <td className="py-3">{c.email}</td>
                                        <td className="py-3">{c.category}</td>
                                        <td className="py-3" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                                        <td className="py-3">
                                            <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                                        </td>
                                        <td className="py-3">
                                            <button
                                                className="btn"
                                                onClick={() => navigate(`/dashboard/complaints/${c._id}`)}
                                                style={{
                                                    backgroundColor: '#dbeafe',
                                                    color: '#1e40af',
                                                    border: '1px solid #bfdbfe',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">No complaints found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default ComplaintTable;
