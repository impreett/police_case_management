import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminUpdateCasePage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllCases = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/admin/all-cases', config);
                setCases(res.data);
            } catch (err) {
                alert('Failed to fetch cases.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllCases();
    }, []);

    if (loading) return <div className="container mt-4"><p>Loading cases...</p></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Update Cases</h2>
            {cases.map(caseItem => (
                <article key={caseItem._id} className="card mb-3">
                    <div className="card-body">
                        <h3 className="card-title">
                            <Link to={`/admin/update-form/${caseItem._id}`}>
                                {caseItem.case_title}
                            </Link>
                        </h3>
                        <p className="card-text mb-1"><b>Handler:</b> {caseItem.case_handler}</p>
                        <p className="card-text mb-1"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                        <p className={`card-text mb-1 fw-bold ${caseItem.isApproved ? 'text-success' : 'text-danger'}`}>
                            <b>Approval:</b> {caseItem.isApproved ? 'Approved' : 'Pending'}
                        </p>
                        <p className="card-text mb-1"><b>Status:</b> {caseItem.status}</p> 
                    </div>
                </article>
            ))}
        </div>
    );
};

export default AdminUpdateCasePage;
