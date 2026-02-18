import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SearchCasePage = () => {
    // Page state
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchField, setSearchField] = useState('for-all');
    const [searchQuery, setSearchQuery] = useState('');
    const [officers, setOfficers] = useState([]);
    const [user, setUser] = useState(null);

    // Load user and officers list
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUser(jwtDecode(token).user);

        const fetchOfficers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/officers');
                setOfficers(res.data.map(o => o.fullname));
            } catch (err) {
                console.error("Failed to fetch officers", err);
            }
        };
        fetchOfficers();
    }, []);

    // Fetch cases whenever field/query/user changes
    useEffect(() => {
        const fetchCases = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { 'x-auth-token': token },
                    params: { field: searchField, query: searchQuery }
                };
                
                // Admins use dedicated search route; clients use regular
                const endpoint = user && user.isAdmin ? '/api/admin/search-cases' : '/api/cases';
                
                const res = await axios.get(`http://localhost:5000${endpoint}`, config);
                setCases(res.data);
            } catch (err) {
                console.error("Error fetching cases:", err);
                setCases([]);
            } finally {
                setLoading(false);
            }
        };

        // Load initial cases and on filter changes
        if (!searchField && !searchQuery) {
             fetchCases();
        } else if (searchField) {
            fetchCases();
        }

    }, [searchQuery, searchField, user]);

    // Render input for each filter type
    const renderSearchInput = () => {
        switch (searchField) {
            case 'case_type':
                return (
                    <select className="form-select" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}>
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
                );
            case 'case_handler':
                return ( <select className="form-select" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}><option value="">Select Officer</option>{officers.map(name => <option key={name} value={name}>{name}</option>)}</select> );
            case 'status':
                return ( <select className="form-select" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}><option value="">Select Status</option><option value="ACTIVE">ACTIVE</option><option value="CLOSE">CLOSE</option></select> );
            case 'isApproved':
                return ( <select className="form-select" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}><option value="">-- Approval Status --</option><option value="1">Approved</option><option value="0">Pending</option></select> );
            case 'case_date':
                return ( <input type="date" className="form-control" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} max={new Date().toISOString().split('T')[0]} /> );
            default:
                return ( <input type="text" className="form-control" placeholder="Enter search value..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> );
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{user && user.isAdmin ? 'Search Case' : 'Search Case'}</h2>
            <div className="card card-body mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <select className="form-select" value={searchField} onChange={(e) => { setSearchField(e.target.value); setSearchQuery(''); }}>
                            <option value="for-all">All</option><option value="case_title">Case Title</option>
                            <option value="case_type">Case Type</option><option value="case_description">Description</option>
                            <option value="suspects">Suspects</option><option value="victim">Victim</option>
                            <option value="guilty_name">Guilty Name</option><option value="case_date">Date</option>
                            <option value="case_handler">Case Handler</option><option value="status">Status</option>
                            {user && user.isAdmin && <option value="isApproved">Approval</option>}
                        </select>
                    </div>
                    <div className="col-md-8">{renderSearchInput()}</div>
                </div>
            </div>
            <h4>Search Results</h4>
            {loading ? ( <p>Loading...</p> ) : cases.length > 0 ? (
                cases.map(caseItem => (
                    <article key={caseItem._id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title"><Link to={`/case/${caseItem._id}`}>{caseItem.case_title}</Link></h3>
                            <p><b>Case ID:</b> {caseItem._id}</p>
                            <p><b>Type:</b> {caseItem.case_type}</p>
                            <p><b>Handler:</b> {caseItem.case_handler}</p>
                            <p><b>Victim:</b> {caseItem.victim || 'N/A'}</p>
                            <p><b>Suspects:</b> {caseItem.suspects || 'N/A'}</p>
                            <p><b>Guilty Name:</b> {caseItem.guilty_name || 'N/A'}</p>
                            <p><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
                            <p><b>Status:</b> {caseItem.status}</p>
                            {user && user.isAdmin && <p className={`fw-bold ${caseItem.isApproved ? 'text-success' : 'text-danger'}`}><b>Approval:</b> {caseItem.isApproved ? 'Approved' : 'Pending'}</p>}
                            <p><b>Description:</b><br /><span style={{ whiteSpace: 'pre-wrap' }}>{caseItem.case_description}</span></p>
                        </div>
                    </article>
                ))
            ) : ( <div className="alert alert-info">No cases found.</div> )}
        </div>
    );
};

export default SearchCasePage;

