import React from 'react';
import { Link } from 'react-router-dom';

// Static Terms & Conditions page
const TermsPage = () => {
    return (
        <>
            {/* Header */}
            <header className="d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#000', color: 'white' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '100px', width: '100px', marginRight: '15px' }} />
                <h1>Police Registration Portal</h1>
            </header>

            {/* Main Content */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Terms & Conditions</h2>

                <div className="card shadow p-4">
                    <h4>1. Acceptance of Terms</h4>
                    <p>By registering on the Police Registration Portal, you agree to abide by these Terms & Conditions. If you do not agree, please do not proceed with registration.</p>

                    <h4>2. User Responsibilities</h4>
                    <ul>
                        <li>You must provide accurate and complete information during registration.</li>
                        <li>It is your responsibility to keep your login credentials confidential.</li>
                        <li>You are responsible for any activity conducted under your registered account.</li>
                    </ul>

                    <h4>3. Data Privacy</h4>
                    <p>All personal information provided during registration will be stored securely. The data will only be used for verification and official purposes related to this portal.</p>

                    <h4>4. Prohibited Activities</h4>
                    <p>Users are not allowed to:</p>
                    <ul>
                        <li>Provide false or misleading information.</li>
                        <li>Attempt to gain unauthorized access to the portal.</li>
                        <li>Share their login details with unauthorized persons.</li>
                    </ul>

                    <h4>5. Account Suspension/Termination</h4>
                    <p>The portal administrators reserve the right to suspend or terminate any account found violating these Terms & Conditions without prior notice.</p>

                    <h4>6. Limitation of Liability</h4>
                    <p>The portal is provided for official purposes only. The developers are not liable for any misuse of the data or unauthorized activities conducted by registered users.</p>

                    <h4>7. Changes to Terms</h4>
                    <p>These Terms & Conditions may be updated from time to time. It is the user’s responsibility to review them periodically.</p>

                    <h4>8. Contact Information</h4>
                    <p>If you have any questions regarding these Terms & Conditions, please contact the system administrator.</p>
                </div>

                <div className="text-center mt-4">
                    <Link to="/register" className="btn btn-dark">Back to Registration</Link>
                </div>
            </div>
            <div style={{ height: '24px' }} />

            {/* Footer */}
            <footer className="text-center" style={{ marginTop: '40px', background: '#f8f9fa', padding: '15px' }}>
                <p> 2025 All rights reserved. Developed by PVD</p>
            </footer>
        </>
    );
};

export default TermsPage;