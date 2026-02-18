import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AdminUpdateFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().split('T')[0];

    useEffect(() => {
        const fetchCaseAndOfficers = async () => {
            try {
                // --- THIS IS THE FIX ---
                // 1. Get the token from storage
                const token = localStorage.getItem('token');
                // 2. Create a config object with the authorization header
                const config = { headers: { 'x-auth-token': token } };
                
                // 3. Send the config object with BOTH requests
                const caseRes = await axios.get(`http://localhost:5000/api/cases/${id}`, config);
                const formattedDate = new Date(caseRes.data.case_date).toISOString().split('T')[0];
                setFormData({ ...caseRes.data, case_date: formattedDate });

                const officersRes = await axios.get('http://localhost:5000/api/admin/active-users', config);
                const names = officersRes.data.map(o => o.fullname);
                const currentHandler = caseRes.data.case_handler;
                if (currentHandler && !names.includes(currentHandler)) {
                    names.unshift(currentHandler);
                }
                setOfficers(names);
            } catch (err) {
                console.error(err);
                alert("Failed to load data. You may not be authorized.");
            } finally {
                setLoading(false);
            }
        };
        fetchCaseAndOfficers();
    }, [id]);

    const onChange = e => {
        const { name, value } = e.target;
        if (name === 'case_date') {
            const v = value || '';
            const clamped = v && v > todayStr ? todayStr : v;
            setFormData({ ...formData, [name]: clamped });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };
    const onCheckboxChange = e => setFormData({ ...formData, [e.target.name]: e.target.checked });


    const validate = () => {
        const errs = {};
        const namesListRegex = /^\s*[A-Za-z]+(?:\s+[A-Za-z]+)*(?:\s*,\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)*\s*$/;

        if (!formData.case_title || (formData.case_title || '').length < 5) {
            errs.case_title = (!formData.case_title) ? 'Please enter the case title' : 'At least 5 characters';
        }
        if (!formData.case_type) {
            errs.case_type = 'Please select a case type';
        }
        if (!formData.case_description || (formData.case_description || '').length < 20) {
            errs.case_description = (!formData.case_description) ? 'Please provide a description' : 'At least 20 characters';
        }
        const checkNamesField = (val) => {
            const v = (val || '').trim();
            if (!v) return "If there is no person, enter N/A.";
            if (v.toUpperCase() === 'N/A') return '';
            return namesListRegex.test(v) ? '' : "Enter names like 'Name, Name, Name'.";
        };

        const sErr = checkNamesField(formData.suspects);
        if (sErr) errs.suspects = sErr;
        const vErr = checkNamesField(formData.victim);
        if (vErr) errs.victim = vErr;
        const gErr = checkNamesField(formData.guilty_name);
        if (gErr) errs.guilty_name = gErr;
        if (!formData.case_date) {
            errs.case_date = 'Please select a case date';
        }
        if (!formData.status) {
            errs.status = 'Please select a case status';
        }
        if (!formData.case_handler) {
            errs.case_handler = 'Please select a case handler';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (!validate()) return;
            if (formData.case_date && formData.case_date > todayStr) {
                alert('Case date cannot be in the future.');
                return;
            }
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/cases/${id}`, formData, config);
            alert('Case updated successfully!');
            navigate('/admin/update-case');
        } catch (err) {
            alert('Error updating case.');
        }
    };

    if(loading) return <div className="container mt-4"><p>Loading form...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            <h3 className="mb-4">Update Case</h3>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Case Title</label>
                  <input type="text" name="case_title" value={formData.case_title || ''} onChange={onChange} className={`form-control ${errors.case_title ? 'is-invalid' : ''}`} />
                  {errors.case_title && <div className="invalid-feedback">{errors.case_title}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Case Type</label>
                  <select name="case_type" value={formData.case_type || ''} onChange={onChange} className={`form-select ${errors.case_type ? 'is-invalid' : ''}`}>
                    <option value="">Select Case Type</option>
                    <option value="Homicide (Murder)">Homicide (Murder)</option>
                    <option value="Manslaughter">Manslaughter</option>
                    <option value="Rape / Sexual Assault">Rape / Sexual Assault</option>
                    <option value="Kidnapping / Abduction">Kidnapping / Abduction</option>
                    <option value="Aggravated Assault">Aggravated Assault</option>
                    <option value="Simple Assault / Battery">Simple Assault / Battery</option>
                    <option value="Robbery">Robbery</option>
                    <option value="Burglary / House Breaking">Burglary / House Breaking</option>
                    <option value="Theft (Larceny)">Theft (Larceny)</option>
                    <option value="Motor Vehicle Theft">Motor Vehicle Theft</option>
                    <option value="Vandalism / Criminal Damage">Vandalism / Criminal Damage</option>
                    <option value="Extortion / Blackmail">Extortion / Blackmail</option>
                    <option value="Cybercrime / Hacking">Cybercrime / Hacking</option>
                    <option value="Fraud / Cheating">Fraud / Cheating</option>
                    <option value="Forgery / Counterfeiting">Forgery / Counterfeiting</option>
                    <option value="Embezzlement / Breach of Trust">Embezzlement / Breach of Trust</option>
                    <option value="Money Laundering">Money Laundering</option>
                    <option value="Drug Offense (NDPS)">Drug Offense (NDPS)</option>
                    <option value="Smuggling / Contraband">Smuggling / Contraband</option>
                    <option value="Illegal Weapons">Illegal Weapons</option>
                    <option value="Illegal Gambling">Illegal Gambling</option>
                    <option value="Public Order / Rioting">Public Order / Rioting</option>
                    <option value="Domestic Violence">Domestic Violence</option>
                    <option value="Missing Person Report">Missing Person Report</option>
                    <option value="Traffic Accident (Non-Fatal)">Traffic Accident (Non-Fatal)</option>
                  </select>
                  {errors.case_type && <div className="invalid-feedback">{errors.case_type}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea name="case_description" value={formData.case_description || ''} onChange={onChange} className={`form-control ${errors.case_description ? 'is-invalid' : ''}`} rows="5"></textarea>
                  {errors.case_description && <div className="invalid-feedback">{errors.case_description}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Suspects</label>
                  <input type="text" name="suspects" value={formData.suspects || ''} onChange={onChange} className={`form-control ${errors.suspects ? 'is-invalid' : ''}`} />
                  {errors.suspects && <div className="invalid-feedback">{errors.suspects}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Victim</label>
                  <input type="text" name="victim" value={formData.victim || ''} onChange={onChange} className={`form-control ${errors.victim ? 'is-invalid' : ''}`} />
                  {errors.victim && <div className="invalid-feedback">{errors.victim}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Guilty Name</label>
                  <input type="text" name="guilty_name" value={formData.guilty_name || ''} onChange={onChange} className={`form-control ${errors.guilty_name ? 'is-invalid' : ''}`} />
                  {errors.guilty_name && <div className="invalid-feedback">{errors.guilty_name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Case Date</label>
                  <input type="date" name="case_date" value={formData.case_date || ''} onChange={onChange} className={`form-control ${errors.case_date ? 'is-invalid' : ''}`} max={todayStr} />
                  {errors.case_date && <div className="invalid-feedback">{errors.case_date}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Case Handler (Assign Officer)</label>
                  <select name="case_handler" value={formData.case_handler || ''} onChange={onChange} className={`form-select ${errors.case_handler ? 'is-invalid' : ''}`}>
                    <option value="">Select Officer</option>
                    {officers.map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                  {errors.case_handler && <div className="invalid-feedback">{errors.case_handler}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select name="status" value={formData.status || ''} onChange={onChange} className={`form-select ${errors.status ? 'is-invalid' : ''}`}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CLOSE">CLOSE</option>
                  </select>
                  {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                </div>
                <button type="submit" className="btn btn-success">Update Case</button>
                <Link to="/admin/update-case" className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    );
};

export default AdminUpdateFormPage;