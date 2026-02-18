import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PublicReportPage = () => {
    // Router and form state
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', reportText: '' });
    const [errors, setErrors] = useState({});

    const { email, reportText } = formData;
    // Handle input change
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Simple client-side validation
    const validate = () => {
        const next = {};
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) next.email = 'Please enter your Email';
        else if (!emailRe.test(email)) next.email = 'Enter a valid Email address';
        if (!reportText) next.reportText = 'Please describe your issue';
        else if ((reportText || '').length < 50) next.reportText = 'Report must be at least 50 characters long';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // Submit public report
    const onSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await axios.post('http://localhost:5000/api/reports/public', formData);
            alert('Your report has been submitted successfully.');
            navigate('/login');
        } catch (err) {
            alert('Error submitting report. Please try again.');
        }
    };

    return (
        <>
            <header className="d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#000', color: 'white' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '100px', width: '100px', marginRight: '15px' }} />
                <h1>Police Login Portal</h1>
            </header>
            <div className="container mt-5">
                <div className="col-md-6 mx-auto">
                    <h3 className="text-center">Report an Issue</h3>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="text"
                              name="email"
                              className={`form-control ${errors.email ? 'error' : ''}`}
                              placeholder="Enter your Email"
                              value={email}
                              onChange={onChange}
                              aria-invalid={errors.email ? 'true' : 'false'}
                              aria-describedby="email-error"
                            />
                            {errors.email && <label id="email-error" className="error" htmlFor="email">{errors.email}</label>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Report</label>
                            <textarea
                              name="reportText"
                              className={`form-control ${errors.reportText ? 'error' : ''}`}
                              rows="6"
                              placeholder="Describe your issue here (min 50 characters)..."
                              value={reportText}
                              onChange={onChange}
                              aria-invalid={errors.reportText ? 'true' : 'false'}
                              aria-describedby="reportText-error"
                            />
                            {errors.reportText && <label id="reportText-error" className="error" htmlFor="reportText">{errors.reportText}</label>}
                        </div>
                        <button type="submit" className="btn btn-dark w-100 mt-3">Submit Report</button>
                    </form>
                    <div className="text-center mt-3">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} className="text-decoration-none">Back</a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PublicReportPage;