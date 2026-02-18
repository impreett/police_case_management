import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminRemovedCasesPage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchRemovedCases = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/removed-cases', config);
            setCases(res.data);
        } catch (err) {
            setMessage('Failed to fetch removed cases.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRemovedCases();
    }, []);

    const handleRestore = async (caseId) => {
        if (window.confirm('Are you sure you want to restore this case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.put(`http://localhost:5000/api/cases/${caseId}/restore`, {}, config);
                setMessage(res.data.msg);
                setCases(cases.filter(c => c._id !== caseId));
            } catch (err) {
                setMessage('Error restoring case.');
            }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading cases...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            <h2 className="mb-4">Removed Cases</h2>
            {message && <div className="alert alert-info">{message}</div>}
            {cases.length > 0 ? (
                cases.map(caseItem => (
                    <article key={caseItem._id} className="card mb-3 bg-light">
                        <div className="card-body">
                            <h3 className="card-title">
                                <Link to={`/case/${caseItem._id}`}>{caseItem.case_title}</Link>
                            </h3>
                            <p className="card-text mb-1"><b>Handler:</b> {caseItem.case_handler}</p>
                            <p className="card-text mb-1"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                            <p className="card-text">{caseItem.case_description.substring(0, 150)}...</p>
                            <button onClick={() => handleRestore(caseItem._id)} className="btn btn-success mt-2">
                                Restore Case
                            </button>
                        </div>
                    </article>
                ))
            ) : (
                <p className="alert alert-warning">No removed cases found.</p>
            )}
        </div>
    );
};

export default AdminRemovedCasesPage;
