import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CaseDetailsPage = () => {
    // Router params and page state
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseItem, setCaseItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Load user from token and fetch case details
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(jwtDecode(token).user);
            } catch (err) { console.error("Invalid Token"); }
        }

        const fetchCaseDetails = async () => {
            try {
                // Get token for protected endpoints
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                // Try admin route first (may include removed cases), fallback to regular
                let res;
                try {
                    res = await axios.get(`http://localhost:5000/api/admin/case/${id}`, config);
                } catch (adminErr) {
                    // If admin route fails, use regular route
                    res = await axios.get(`http://localhost:5000/api/cases/${id}`, config);
                }
                setCaseItem(res.data);
            } catch (err) {
                setError('Could not fetch case details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseDetails();
    }, [id]);

    // Approve case (admin)
    const handleApprove = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/admin/approve-case/${id}`, null, config);
            setSuccessMessage('Case approved!');
            setCaseItem(prev => prev ? { ...prev, isApproved: true } : prev);
            window.scrollTo(0, 0);
        } catch (err) { alert('Error approving case.'); }
    };

    // Deny case (admin)
    const handleDeny = async () => {
        if (window.confirm('Are you sure you want to deny this case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`http://localhost:5000/api/admin/deny-case/${id}`, config);
                navigate(-1);
            } catch (err) { alert('Error denying case.'); }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading details...</p></div>;
    if (error) return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
    if (!caseItem) return <div className="container mt-4"><p>Case not found.</p></div>;

    // View for regular clients
    const clientView = (
        <>
            <h2 className="mb-4">Case Details</h2>
            
            <article style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '20px', background: '#fff', marginBottom: '30px' }}>
                <h3>{caseItem.case_title}</h3>
                <p><b>Case ID:</b> {caseItem._id}</p>
                <p><b>Type:</b> {caseItem.case_type}</p>
                <p><b>Handler:</b> {caseItem.case_handler}</p>
                <p><b>Victim:</b> {caseItem.victim || 'N/A'}</p>
                <p><b>Suspects:</b> {caseItem.suspects || 'N/A'}</p>
                <p><b>Guilty Name:</b> {caseItem.guilty_name || 'N/A'}</p>
                <p><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                <p><b>Status:</b> {caseItem.status}</p>
                <p className="desc-box"><b>Description:</b><br /><span style={{ whiteSpace: 'pre-wrap' }}>{caseItem.case_description}</span></p>
            </article>
        </>
    );

    // View for admins
    const adminView = (
        <>
            <h2 className="mb-4">Case Details</h2>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
                </div>
            )}
            <article style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '20px', background: '#fff', marginBottom: '30px' }}>
                <h3>{caseItem.case_title}</h3>
                <p><b>Case ID:</b> {caseItem._id}</p>
                <p><b>Type:</b> {caseItem.case_type}</p>
                <p><b>Handler:</b> {caseItem.case_handler}</p>
                <p><b>Victim:</b> {caseItem.victim || 'N/A'}</p>
                <p><b>Suspects:</b> {caseItem.suspects || 'N/A'}</p>
                <p><b>Guilty Name:</b> {caseItem.guilty_name || 'N/A'}</p>
                <p><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                <p><b>Status:</b> {caseItem.status}</p>
                <p><b>Approval:</b> {caseItem.isApproved ? "Approved" : "Pending"}</p>
                <p className="desc-box"><b>Description:</b><br /><span style={{ whiteSpace: 'pre-wrap' }}>{caseItem.case_description}</span></p>
                
                {!caseItem.isApproved ? (
                    <div className="mt-3">
                        <button onClick={handleApprove} className="btn btn-success me-2">Approve</button>
                        <button onClick={handleDeny} className="btn btn-danger">Deny</button>
                    </div>
                ) : (
                    <p className="alert alert-success mt-3">This case is approved.</p>
                )}
            </article>
        </>
    );

    return (
        <div className="container mt-4">
            {user && user.isAdmin ? adminView : clientView}
        </div>
    );
};

export default CaseDetailsPage;
