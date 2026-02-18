import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActiveUsersPage = () => {
    // Page state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load active (approved) non-admin users
    const fetchActiveUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/admin/active-users', config);
            const payload = res?.data;
            const normalized = Array.isArray(payload)
                ? payload
                : (Array.isArray(payload?.users) ? payload.users : []);
            setUsers(normalized);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch active users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveUsers();
    }, []);

    // Disable user and remove from list
    const handleDisable = async (userId) => {
        if (window.confirm('Are you sure you want to disable this user? You can again enable them from the pending users page.')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.put(`http://localhost:5000/api/admin/disable-user/${userId}`, null, config);
               
                // Remove the user from the list in the UI
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                console.error(err);
                alert('Error disabling user.');
            }
        }
    };

    // Loading state
    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

    const hasUsers = Array.isArray(users) && users.length > 0;

    if (!hasUsers) {
        return (
            <div className="container mt-4">
                <h2 className="mb-4">Active Users</h2>
                <div className="alert alert-info">No active users found.</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Active Users</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Full Name</th>
                            <th>Police ID</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>City</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullname}</td>
                                <td>{user.police_id}</td>
                                <td>{user.email}</td>
                                <td>{user.contact}</td>
                                <td>{user.city}</td>
                                <td>
                                    <button onClick={() => handleDisable(user._id)} className="btn btn-danger btn-sm">
                                        Disable
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveUsersPage;