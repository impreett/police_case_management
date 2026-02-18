import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingUsersPage = () => {
    // Page state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    // Load users awaiting approval
    const fetchPendingUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/pending-users', config);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch pending users. You may not be an admin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // Approve a user and update the list
    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/admin/approve-user/${userId}`, null, config);
            setSuccessMessage('User approved!');
            setUsers(users.filter(user => user._id !== userId));
            window.scrollTo(0, 0);
        } catch (err) {
            console.error(err);
            alert('Error approving user.');
        }
    };
    
    // Deny a user and remove from list
    const handleDeny = async (userId) => {
        if (window.confirm('Are you sure you want to deny this user?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`http://localhost:5000/api/admin/deny-user/${userId}`, config);
               
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                console.error(err);
                alert('Error denying user.');
            }
        }
    };

    // Loading state
    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

    return (
        <div className="container mt-4" style={{ marginBottom: '30px' }}>
            <h2 className="mb-4">Users Pending Approval</h2>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
                </div>
            )}
            {users.length > 0 ? (
                users.map(user => (
                    <article key={user._id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{user.fullname}</h5>
                            <p className="card-text mb-1"><b>Email:</b> {user.email}</p>
                            <p className="card-text mb-1"><b>Police ID:</b> {user.police_id}</p>
                            <p className="card-text"><b>City:</b> {user.city}</p>
                            <div>
                                <button onClick={() => handleApprove(user._id)} className="btn btn-success me-2">Approve</button>
                                <button onClick={() => handleDeny(user._id)} className="btn btn-danger">Deny</button>
                            </div>
                        </div>
                    </article>
                ))
            ) : (
                <div className="alert alert-info">No users are currently pending approval.</div>
            )}
        </div>
    );
};

export default PendingUsersPage;