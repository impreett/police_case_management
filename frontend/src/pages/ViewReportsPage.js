import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/reports', config);
            setReports(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleMarkAsRead = async (reportId) => {
        if (window.confirm('Are you sure you want to mark this report as read?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`http://localhost:5000/api/reports/${reportId}`, config);
                setReports(reports.filter(report => report._id !== reportId));
            } catch (err) {
                console.error(err);
                alert('Error removing report.');
            }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading reports...</p></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">All Reports</h2>
            {reports.length > 0 ? (
                reports.map(report => (
                    <article key={report._id} className="card mb-3">
                        <div className="card-body">
                            <p className="card-text mb-2"><b>From:</b> {report.email}</p>
                            <p className="card-text mb-2"><b>Date:</b> {new Date(report.date).toLocaleString()}</p>
                            <p className="card-text mt-2" style={{ whiteSpace: 'pre-wrap' }}><b>Report: </b>{report.reportText}</p>
                            <button onClick={() => handleMarkAsRead(report._id)} className="btn btn-danger">Mark as Read</button>
                        </div>
                    </article>
                ))
            ) : (
                <div className="alert alert-info">No reports found.</div>
            )}
        </div>
    );
};

export default ViewReportsPage;