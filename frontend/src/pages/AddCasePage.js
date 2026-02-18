import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AddCasePage = () => {
    /* Navigation and component state management */
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [officers, setOfficers] = useState([]);
    /* Form data and validation state */
    const [formData, setFormData] = useState({
        case_title: '', case_type: '', case_description: '', suspects: '',
        victim: '', guilty_name: '', case_date: '', status: 'ACTIVE', case_handler: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    /* Fetch authenticated user and officer data when component mounts */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token).user;
            setUser(decodedUser);

            if (decodedUser.isAdmin) {
                /* Fetch list of approved officers for case handler assignment (admin only) */
                const fetchOfficers = async () => {
                    try {
                        const config = { headers: { 'x-auth-token': token } };
                        const res = await axios.get('http://localhost:5000/api/users/officers', config);
                        setOfficers(res.data.map(o => o.fullname));
                    } catch (err) { console.error("Failed to fetch officers", err); }
                };
                fetchOfficers();
            } else {
                /* Auto-assign current user as case handler (regular users) */
                setFormData(prevState => ({ ...prevState, case_handler: decodedUser.fullname }));
            }
        }
    }, []);

    /* Form validation logic */
    const validate = () => {
        let tempErrors = {};
        const namesListRegex = /^\s*[A-Za-z]+(?:\s+[A-Za-z]+)*(?:\s*,\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)*\s*$/;

        if (!formData.case_title || formData.case_title.length < 5) tempErrors.case_title = "Title must be at least 5 characters.";
        if (!formData.case_type) tempErrors.case_type = "Please select a case type.";
        if (!formData.case_description || formData.case_description.length < 20) tempErrors.case_description = "Description must be at least 20 characters.";
        if (!formData.case_date) tempErrors.case_date = "Case date is required.";
        if (user && user.isAdmin && !formData.case_handler) tempErrors.case_handler = "Please select a case handler.";

        const checkNamesField = (val) => {
            const v = (val || '').trim();
            if (!v) return "If there is no person, enter N/A.";
            if (v.toUpperCase() === 'N/A') return '';
            return namesListRegex.test(v) ? '' : "Enter names like 'Name, Name, Name'.";
        };

        const sErr = checkNamesField(formData.suspects);
        if (sErr) tempErrors.suspects = sErr;
        const vErr = checkNamesField(formData.victim);
        if (vErr) tempErrors.victim = vErr;
        const gErr = checkNamesField(formData.guilty_name);
        if (gErr) tempErrors.guilty_name = gErr;

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => !x);
    };

    /* Update form state when input values change */
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /* Handle case submission to API */
    const onSubmit = async e => {
        e.preventDefault();
        if (validate()) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const newCaseData = { ...formData, isApproved: user.isAdmin }; 
                await axios.post('http://localhost:5000/api/cases', newCaseData, config);
                setSuccessMessage('Case added successfully!');
                /* Reset form fields after successful submission */
                setFormData({
                    case_title: '', case_type: '', case_description: '', suspects: '',
                    victim: '', guilty_name: '', case_date: '', status: 'ACTIVE', case_handler: user.isAdmin ? '' : user.fullname
                });
                /* Scroll to the top to ensure success message visibility */
                window.scrollTo(0, 0);
            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setSuccessMessage('');
                alert('Error adding case: ' + (err.response?.data?.msg || err.message));
            }
        }
    };

    /* Conditionally render case handler field based on user role */
    const renderCaseHandlerInput = () => {
        if (user && user.isAdmin) {
            return (
                <div className="mb-3">
                    <label className="form-label">Case Handler (Assign Officer)</label>
                    <select name="case_handler" value={formData.case_handler} onChange={onChange} className={`form-select ${errors.case_handler ? 'is-invalid' : ''}`}>
                        <option value="">Select Officer</option>
                        {officers.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    {errors.case_handler && <div className="invalid-feedback">{errors.case_handler}</div>}
                </div>
            );
        }
        return (
            <div className="mb-3">
                <label className="form-label">Case Handler</label>
                <input type="text" className="form-control" value={formData.case_handler} readOnly />
            </div>
        );
    };

    return (
        <div className="container mt-4">
            {/* Success notification with dismissible alert */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
                </div>
            )}
            {/* Main content card with form */}
            <div className="p-4" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px #ccc', marginBottom: '30px' }}>
                <h2 className="mb-4 text-center">Add New Case</h2>
                {/* Case creation form with validation */}
                <form onSubmit={onSubmit} noValidate>
                    <div className="mb-3"><label className="form-label">Case Title</label><input type="text" className={`form-control ${errors.case_title ? 'is-invalid' : ''}`} name="case_title" value={formData.case_title} onChange={onChange} />{errors.case_title && <div className="invalid-feedback">{errors.case_title}</div>}</div>
                    <div className="mb-3"><label className="form-label">Case Type</label><select className={`form-select ${errors.case_type ? 'is-invalid' : ''}`} name="case_type" value={formData.case_type} onChange={onChange}><option value="">Select Case Type</option><option value="Homicide (Murder)">Homicide (Murder)</option><option value="Manslaughter">Manslaughter</option><option value="Rape / Sexual Assault">Rape / Sexual Assault</option><option value="Kidnapping / Abduction">Kidnapping / Abduction</option><option value="Aggravated Assault">Aggravated Assault</option><option value="Simple Assault / Battery">Simple Assault / Battery</option><option value="Robbery">Robbery</option><option value="Burglary / House Breaking">Burglary / House Breaking</option><option value="Theft (Larceny)">Theft (Larceny)</option><option value="Motor Vehicle Theft">Motor Vehicle Theft</option><option value="Vandalism / Criminal Damage">Vandalism / Criminal Damage</option><option value="Extortion / Blackmail">Extortion / Blackmail</option><option value="Cybercrime / Hacking">Cybercrime / Hacking</option><option value="Fraud / Cheating">Fraud / Cheating</option><option value="Forgery / Counterfeiting">Forgery / Counterfeiting</option><option value="Embezzlement / Breach of Trust">Embezzlement / Breach of Trust</option><option value="Money Laundering">Money Laundering</option><option value="Drug Offense (NDPS)">Drug Offense (NDPS)</option><option value="Smuggling / Contraband">Smuggling / Contraband</option><option value="Illegal Weapons">Illegal Weapons</option><option value="Illegal Gambling">Illegal Gambling</option><option value="Public Order / Rioting">Public Order / Rioting</option><option value="Domestic Violence">Domestic Violence</option><option value="Missing Person Report">Missing Person Report</option><option value="Traffic Accident (Non-Fatal)">Traffic Accident (Non-Fatal)</option></select>{errors.case_type && <div className="invalid-feedback">{errors.case_type}</div>}</div>
                    <div className="mb-3"><label className="form-label">Case Description</label><textarea className={`form-control ${errors.case_description ? 'is-invalid' : ''}`} name="case_description" value={formData.case_description} onChange={onChange} rows="5"></textarea>{errors.case_description && <div className="invalid-feedback">{errors.case_description}</div>}</div>
                    <div className="mb-3">
                        <label className="form-label">Suspects</label>
                        <input type="text" className={`form-control ${errors.suspects ? 'is-invalid' : ''}`} name="suspects" value={formData.suspects} onChange={onChange} />
                        {errors.suspects && <div className="invalid-feedback">{errors.suspects}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Victim</label>
                        <input type="text" className={`form-control ${errors.victim ? 'is-invalid' : ''}`} name="victim" value={formData.victim} onChange={onChange} />
                        {errors.victim && <div className="invalid-feedback">{errors.victim}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Guilty Name</label>
                        <input type="text" className={`form-control ${errors.guilty_name ? 'is-invalid' : ''}`} name="guilty_name" value={formData.guilty_name} onChange={onChange} />
                        {errors.guilty_name && <div className="invalid-feedback">{errors.guilty_name}</div>}
                    </div>
                    <div className="mb-3"><label className="form-label">Case Date</label><input type="date" className={`form-control ${errors.case_date ? 'is-invalid' : ''}`} name="case_date" value={formData.case_date} onChange={onChange} max={new Date().toISOString().split('T')[0]} />{errors.case_date && <div className="invalid-feedback">{errors.case_date}</div>}</div>
                    {renderCaseHandlerInput()}
                    <div className="mb-3"><label className="form-label">Status</label>{user && user.isAdmin ? (<select className="form-select" name="status" value={formData.status} onChange={onChange}><option value="ACTIVE">ACTIVE</option><option value="CLOSE">CLOSE</option></select>) : (<input type="text" className="form-control" name="status" value="ACTIVE" readOnly />)}</div>
                    <button type="submit" className="btn btn-primary w-100">Add Case</button>
                </form>
            </div>
        </div>
    );
};

export default AddCasePage;
