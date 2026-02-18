import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminRemoveCasePage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchAllCases = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/all-cases', config);
            setCases(res.data);
        } catch (err) {
            setMessage('Failed to fetch cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCases();
    }, []);

    const handleRemove = async (caseId) => {
        if (window.confirm('Are you sure you want to remove this case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`http://localhost:5000/api/cases/${caseId}`, config);
                setMessage('Case removed successfully!');
                // Refresh the list by filtering out the deleted case
                setCases(cases.filter(c => c._id !== caseId));
                window.scrollTo(0, 0);
            } catch (err) {
                setMessage('Error removing case.');
            }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading cases...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            <h2 className="mb-4">Remove Cases</h2>
            {message && <div className="alert alert-info">{message}</div>}
            {cases.map(caseItem => (
                <article key={caseItem._id} className="card mb-3">
                    <div className="card-body">
                        <h3 className="card-title">
                            <Link to={`/case/${caseItem._id}`}>{caseItem.case_title}</Link>
                        </h3>
                        <p className="card-text mb-1"><b>Handler:</b> {caseItem.case_handler}</p>
                        <p className="card-text mb-1"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                        <p className={`card-text mb-1 fw-bold ${caseItem.isApproved ? 'text-success' : 'text-danger'}`}>
                            <b>Approval:</b> {caseItem.isApproved ? "Approved" : "Pending"}
                        </p>
                        <p className="card-text">{caseItem.case_description.substring(0, 150)}...</p>
                        <button onClick={() => handleRemove(caseItem._id)} className="btn btn-danger mt-2">
                            Remove Case
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default AdminRemoveCasePage;
