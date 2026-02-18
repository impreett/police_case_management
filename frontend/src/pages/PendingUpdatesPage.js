import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingUpdatesPage = () => {
    const [updates, setUpdates] = useState([]);
    const [originals, setOriginals] = useState({}); // map originalCaseId -> original case
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    const fetchPendingUpdates = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/pending-updates', config);
            setUpdates(res.data || []);

            const ids = Array.from(new Set((res.data || [])
                .map(u => u.originalCaseId)
                .filter(Boolean)));
            if (ids.length) {
                const pairs = await Promise.all(ids.map(async (id) => {
                    try {
                        const r = await axios.get(`http://localhost:5000/api/cases/${id}`, config);
                        return [id, r.data];
                    } catch {
                        return [id, null];
                    }
                }));
                setOriginals(Object.fromEntries(pairs));
            } else {
                setOriginals({});
            }
        } catch (err) {
            alert('Failed to fetch pending updates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUpdates();
    }, []);

    const handleApprove = async (updateId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/admin/approve-update/${updateId}`, null, config);
            setSuccessMessage('Update approved and applied successfully!');
            setInfoMessage('');
            setUpdates(prev => prev.filter(u => u._id !== updateId));
            window.scrollTo(0, 0);
        } catch (err) {
            alert('Error approving update.');
        }
    };

    const handleDeny = async (updateId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.delete(`http://localhost:5000/api/admin/deny-update/${updateId}`, config);
            setInfoMessage('Update request cancelled successfully!');
            setSuccessMessage('');
            setUpdates(prev => prev.filter(u => u._id !== updateId));
            window.scrollTo(0, 0);
        } catch (err) {
            alert('Error denying update.');
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

    const renderRow = (label, left, right) => (
        <tr>
            <th>{label}</th>
            <td>{left}</td>
        </tr>
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Pending Case Updates</h2>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}
            {infoMessage && (
                <div className="alert alert-info alert-dismissible fade show text-center" role="alert">
                    {infoMessage}
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setInfoMessage('')}></button>
                </div>
            )}
            {updates.length > 0 ? (
                updates.map(update => {
                    const orig = originals[update.originalCaseId] || null;
                    return (
                        <div key={update._id} className="card mb-4 shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <strong>Case ID: {update.originalCaseId}</strong>
                                <div>
                                    <button onClick={() => handleApprove(update._id)} className="btn btn-success btn-sm me-2">Approve</button>
                                    <button onClick={() => handleDeny(update._id)} className="btn btn-danger btn-sm">Cancel</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <h5 className="text-muted">Original</h5>
                                        <table className="table table-sm table-striped">
                                            <tbody>
                                                <tr><th>Title</th><td>{orig?.case_title || ''}</td></tr>
                                                <tr><th>Type</th><td>{orig?.case_type || ''}</td></tr>
                                                <tr><th>Description</th><td><span style={{whiteSpace:'pre-wrap'}}>{orig?.case_description || ''}</span></td></tr>
                                                <tr><th>Suspects</th><td>{orig?.suspects || ''}</td></tr>
                                                <tr><th>Victim</th><td>{orig?.victim || ''}</td></tr>
                                                <tr><th>Guilty</th><td>{orig?.guilty_name || ''}</td></tr>
                                                <tr><th>Date</th><td>{orig?.case_date || ''}</td></tr>
                                                <tr><th>Handler</th><td>{orig?.case_handler || ''}</td></tr>
                                                <tr><th>Status</th><td>{orig?.status || orig?.active_close || ''}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <h5 className="text-muted">Update Request</h5>
                                        <table className="table table-sm table-striped">
                                            <tbody>
                                                <tr><th>Title</th><td>{update.case_title}</td></tr>
                                                <tr><th>Type</th><td>{update.case_type}</td></tr>
                                                <tr><th>Description</th><td><span style={{whiteSpace:'pre-wrap'}}>{update.case_description}</span></td></tr>
                                                <tr><th>Suspects</th><td>{update.suspects}</td></tr>
                                                <tr><th>Victim</th><td>{update.victim}</td></tr>
                                                <tr><th>Guilty</th><td>{update.guilty_name}</td></tr>
                                                <tr><th>Date</th><td>{update.case_date}</td></tr>
                                                <tr><th>Handler</th><td>{update.case_handler}</td></tr>
                                                <tr><th>Status</th><td>{update.status}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="alert alert-info">No pending case updates found.</div>
            )}
        </div>
    );
};

export default PendingUpdatesPage;