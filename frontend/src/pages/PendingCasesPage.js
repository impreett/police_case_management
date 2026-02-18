import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PendingCasesPage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const fetchPendingCases = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/pending-cases', config);
            setCases(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch pending cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCases();
    }, []);

    useEffect(() => {
        if (location.state && location.state.success) {
            setSuccessMessage(location.state.success);
            window.scrollTo(0, 0);
            navigate('.', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const handleApprove = async (caseId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/admin/approve-case/${caseId}`, null, config);
            setSuccessMessage('Case approved!');
            setCases(cases.filter(c => c._id !== caseId));
            window.scrollTo(0, 0);
        } catch (err) {
            alert('Error approving case.');
        }
    };

    const handleDeny = async (caseId) => {
        if (window.confirm('Are you sure you want to deny this case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`http://localhost:5000/api/admin/deny-case/${caseId}`, config);
                setCases(cases.filter(c => c._id !== caseId));
            } catch (err) {
                alert('Error denying case.');
            }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            <h2 className="mb-4">Pending Cases</h2>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
                </div>
            )}
            {cases.length > 0 ? (
                cases.map(caseItem => (
                    <article key={caseItem._id} className="card mb-3">
                        <div className="card-body">
                             <h3 className="card-title">
                                <Link to={`/case/${caseItem._id}`} className="text-dark text-decoration-none">
                                    {caseItem.case_title}
                                </Link>
                            </h3>
                            <p className="card-text mb-1"><b>Handler:</b> {caseItem.case_handler}</p>
                            <p className="card-text mb-1"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                            <p className="card-text">{caseItem.case_description.substring(0, 150)}...</p>
                            <div className="mt-3">
                                <button onClick={() => handleApprove(caseItem._id)} className="btn btn-success me-2">Approve</button>
                                <button onClick={() => handleDeny(caseItem._id)} className="btn btn-danger">Deny</button>
                            </div>
                        </div>
                    </article>
                ))
            ) : (
                <p className="alert alert-info">No pending cases found.</p>
            )}
        </div>
    );
};

export default PendingCasesPage;
