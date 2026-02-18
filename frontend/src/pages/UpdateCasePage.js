import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateCasePage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCaseId, setEditingCaseId] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const response = await axios.get('http://localhost:5000/api/cases/me/assigned', config);
                setCases(response.data);
            } catch (err) { console.error("Error fetching cases:", err); }
            finally { setLoading(false); }
        };
        fetchCases();
    }, []);

    const handleEditClick = (caseItem) => {
        setEditingCaseId(caseItem._id);
        const formattedDate = new Date(caseItem.case_date).toISOString().split('T')[0];
        setFormData({ ...caseItem, case_date: formattedDate });
        setSuccessMessage(''); // Clear success message when editing
    };

    const handleCancel = () => {
        setEditingCaseId(null);
        setFormData({});
        setErrors({});
    };

    const validate = () => {
        const errs = {};
        const namesListRegex = /^\s*[A-Za-z]+(?:\s+[A-Za-z]+)*(?:\s*,\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)*\s*$/;

        if (!formData.case_title || (formData.case_title || '').length < 5) {
            errs.case_title = !formData.case_title ? 'Please enter the case title' : 'At least 5 characters';
        }
        if (!formData.case_type) {
            errs.case_type = 'Please select a case type';
        }
        if (!formData.case_description || (formData.case_description || '').length < 20) {
            errs.case_description = !formData.case_description ? 'Please provide a description' : 'At least 20 characters';
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

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                // Exclude _id, __v, and other MongoDB fields from the update request
                const { _id, __v, isApproved, is_removed, createdAt, updatedAt, ...cleanFormData } = formData;
                const updateRequestData = { ...cleanFormData, originalCaseId: editingCaseId };
                await axios.post(`http://localhost:5000/api/cases/request-update`, updateRequestData, config);
                setSuccessMessage('Update request submitted successfully!');
                setEditingCaseId(null);
                setFormData({});
                setErrors({});
                window.scrollTo(0, 0);
            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setSuccessMessage('');
                alert('Error submitting update request: ' + (err.response?.data?.error || err.response?.data?.msg || err.message));
            }
        }
    };

    if (loading) return <div className="container mt-4"><p>Loading cases...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
                </div>
            )}
            <h2 className="mb-4">Update Cases</h2>
            {cases.length === 0 ? (
                <div className="alert alert-info">No cases found.</div>
            ) : (
            cases.map(caseItem => (
                <article key={caseItem._id} className="card mb-3">
                    <div className="card-body">
                        {editingCaseId !== caseItem._id ? (
                            <>
                                <h3 className="card-title">{caseItem.case_title}</h3>
                                <p className="card-text mb-2"><b>Handler:</b> {caseItem.case_handler}</p>
                                <p className="card-text mb-2"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                                <p className="card-text mb-2"><b>Status:</b> {caseItem.status}</p>
                                <p className="card-text mb-2">{caseItem.case_description.substring(0, 150)}...</p>
                                <button onClick={() => handleEditClick(caseItem)} className="btn btn-warning mt-2">Update</button>
                            </>
                        ) : (
                            <form onSubmit={onSubmit} noValidate>
                                <p>
                                  <b>Title:</b> 
                                  <input
                                    type="text"
                                    name="case_title"
                                    value={formData.case_title}
                                    onChange={onChange}
                                    className={`form-control ${errors.case_title ? 'error' : ''}`}
                                    aria-invalid={errors.case_title ? 'true' : 'false'}
                                  />
                                  {errors.case_title && (
                                    <label id="case_title-error" className="error" htmlFor="case_title">{errors.case_title}</label>
                                  )}
                                </p>
                                
                                <p><b>Type:</b> 
                                    <select
                                      name="case_type"
                                      value={formData.case_type}
                                      onChange={onChange}
                                      className={`form-select ${errors.case_type ? 'error' : ''}`}
                                      aria-invalid={errors.case_type ? 'true' : 'false'}
                                    >
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
                                    {errors.case_type && (
                                      <label id="case_type-error" className="error" htmlFor="case_type">{errors.case_type}</label>
                                    )}
                                </p>

                                <p>
                                  <b>Description:</b> 
                                  <textarea
                                    name="case_description"
                                    value={formData.case_description}
                                    onChange={onChange}
                                    className={`form-control ${errors.case_description ? 'error' : ''}`}
                                    aria-invalid={errors.case_description ? 'true' : 'false'}
                                  />
                                  {errors.case_description && (
                                    <label id="case_description-error" className="error" htmlFor="case_description">{errors.case_description}</label>
                                  )}
                                </p>

                                <p>
                                  <b>Suspects:</b> 
                                  <input type="text" name="suspects" value={formData.suspects} onChange={onChange} className={`form-control ${errors.suspects ? 'error' : ''}`} aria-invalid={errors.suspects ? 'true' : 'false'} />
                                  {errors.suspects && <label id="suspects-error" className="error" htmlFor="suspects">{errors.suspects}</label>}
                                </p>
                                <p>
                                  <b>Victim:</b> 
                                  <input type="text" name="victim" value={formData.victim} onChange={onChange} className={`form-control ${errors.victim ? 'error' : ''}`} aria-invalid={errors.victim ? 'true' : 'false'} />
                                  {errors.victim && <label id="victim-error" className="error" htmlFor="victim">{errors.victim}</label>}
                                </p>
                                <p>
                                  <b>Guilty Name:</b> 
                                  <input type="text" name="guilty_name" value={formData.guilty_name} onChange={onChange} className={`form-control ${errors.guilty_name ? 'error' : ''}`} aria-invalid={errors.guilty_name ? 'true' : 'false'} />
                                  {errors.guilty_name && <label id="guilty_name-error" className="error" htmlFor="guilty_name">{errors.guilty_name}</label>}
                                </p>
                                
                                <p>
                                  <b>Date:</b> 
                                  <input type="date" name="case_date" value={formData.case_date} onChange={onChange} className={`form-control ${errors.case_date ? 'error' : ''}`} aria-invalid={errors.case_date ? 'true' : 'false'} max={new Date().toISOString().split('T')[0]} />
                                  {errors.case_date && <label id="case_date-error" className="error" htmlFor="case_date">{errors.case_date}</label>}
                                </p>
                                
                                <p><b>Handler:</b> <input type="text" name="case_handler" value={formData.case_handler} onChange={onChange} className="form-control" readOnly /></p>
                                
                                <p><b>Status:</b> 
                                    <select name="status" value={formData.status} onChange={onChange} className={`form-select ${errors.status ? 'error' : ''}`} aria-invalid={errors.status ? 'true' : 'false'}>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="CLOSE">CLOSE</option>
                                    </select>
                                </p>
                                {errors.status && <label id="status-error" className="error" htmlFor="status">{errors.status}</label>}
                                <p className="mt-3">
                                    <button type="submit" className="btn btn-primary">Submit Update</button>
                                    <button type="button" onClick={handleCancel} className="btn btn-secondary ms-2">Cancel</button>
                                </p>
                            </form>
                        )}
                    </div>
                </article>
            ))
            )}
        </div>
    );
};

export default UpdateCasePage;
