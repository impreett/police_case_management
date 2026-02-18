import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  /* State management for form data and validation errors */
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { email, password } = formData;
  /* Update form state when input values change */
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  /* Client-side form validation logic */
  const validate = () => {
    const next = { email: '', password: '' };
    if (!email) next.email = 'Please enter your Email';
    else {
      /* Simple email validation regex pattern */
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) next.email = 'Enter a valid Email address';
    }
    if (!password) next.password = 'Please enter your password';
    setErrors(next);
    return !next.email && !next.password;
  };

  /* Form submission handler for login */
  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = res.data.token;

      /* Helper function to extract approval status with type safety */
      const getApproval = (u) => (u && typeof u.isApproved === 'boolean') ? u.isApproved : null;

      /* Extract user data from various response structures with fallback chain */
      let userFromRes = res.data && (res.data.user || res.data.data || res.data || null);
      const resApproval = getApproval(userFromRes);
      if (resApproval === false) {
        alert('Your credentials are under review. If you were an approved user, your ID is disabled. For further information, please submit a report.');
        return; // do not store token or redirect
      }

      /* Fallback 1: Decode JWT token and verify user approval status from claims */
      try {
        const decoded = jwtDecode(token);
        const user = decoded && (decoded.user || decoded.data || decoded || null);
        const decApproval = getApproval(user);
        if (decApproval === false) {
          alert('Your credentials are under review. If you were an approved user, your ID is disabled. For further information, please submit a report.');
          return; // do not store token or redirect
        }
      } catch (_) {
        /* Silently handle token decode errors and continue with authentication flow */
      }

      /* Fallback 2: Make additional API request to verify user approval status */
      try {
        const me = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = me.data && (me.data.user || me.data.data || me.data);
        const meApproval = getApproval(profile);
        if (meApproval === false) {
          alert('Your credentials are under review. If you were an approved user, your ID is disabled. For further information, please submit a report.');
          return;
        }
      } catch (_) {
        /* Continue with login flow if profile endpoint is unavailable */
      }
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        alert('Your credentials are under review. If you were an approved user, your ID is disabled. For further information, please submit a report.');
        return;
      }
      const data = err.response && err.response.data ? err.response.data : {};
      const msg = (data.msg || data.message || '').toString().toLowerCase();
      if (msg.includes('under review') || msg.includes('not approved') || msg.includes('disabled') || msg.includes('approval')) {
        alert('Your credentials are under review. If you were an approved user, your ID is disabled. For further information, please submit a report.');
      } else {
        alert('Invalid Email or Password');
      }
    }
  };

  return (
    <>
      <style>{`
        .error { color: #dc3545; margin-top: 4px; font-size: 0.875rem; }
        .is-invalid { border-color: #dc3545 !important; }
      `}</style>
      {/* Application header with logo and title */}
      <header className="d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#000', color: 'white' }}><img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" style={{ height: '100px', width: '100px', marginRight: '15px' }} /><h1>Police Login Portal</h1></header>
      <div className="container mt-5">
        <div className="col-md-6 mx-auto">
          <h3 className="text-center">User Login</h3>
          {/* Authentication form with validation */}
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={onChange}
                placeholder="Enter your Email"
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <p>Don't have an account? <Link to="/register">Register here</Link>.</p>
            
            
            <button type="submit" className="btn btn-dark w-100 mt-3">Login</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;