import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ReportPage = () => {
    // Router and page state
    const navigate = useNavigate();
    const [reportText, setReportText] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [tokenError, setTokenError] = useState(false);
    const [errors, setErrors] = useState({});

    // Load email from token (or mark as outdated)
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const user = jwtDecode(token).user;
                // If the email exists in the token, display it
                if (user && user.email) {
                    setUserEmail(user.email);
                } else {
                    // If the email is missing, it's an old token. Set an error.
                    setTokenError(true);
                    setUserEmail('N/A - Your login session is outdated.');
                }
            }
        } catch (error) {
            console.error("Failed to decode token", error);
            setTokenError(true);
        }
    }, []);

    // Client-side validation
    const validate = () => {
        const tempErrors = {};
        
        if (!reportText || reportText.trim() === '') {
            tempErrors.reportText = 'Please describe your issue';
        } else if (reportText.trim().length < 50) {
            tempErrors.reportText = 'Report must be at least 50 characters';
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Submit report
    const onSubmit = async (e) => {
        e.preventDefault();
        if (tokenError) {
            return alert('Your login session is outdated. Please log out and log in again to submit a report.');
        }
        if (!validate()) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post('http://localhost:5000/api/reports', { email: userEmail, reportText }, config);
            alert('Your report has been submitted successfully.');
            navigate('/');
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            alert('Error submitting report: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
        }
    };

    return (
        <div className="container mt-4">
            <div className="col-md-6 mx-auto">
                <h3 className="text-center mb-4">Report an Issue</h3>
                {tokenError && (
                    <div className="alert alert-danger">
                        Your login session is outdated. Please log out and log in again to use this feature.
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={userEmail} readOnly />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Report</label>
                        <textarea 
                            className={`form-control ${errors.reportText ? 'is-invalid' : ''}`} 
                            rows="6" 
                            placeholder="Please describe your issue here..." 
                            value={reportText} 
                            onChange={(e) => { setReportText(e.target.value); setErrors({}); }}
                        ></textarea>
                        {errors.reportText && (
                            <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                                {errors.reportText}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-dark w-100 mt-3" disabled={tokenError}>Submit Report</button>
                </form>
            </div>
        </div>
    );
};

export default ReportPage;