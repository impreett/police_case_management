import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '', police_id: '', contact: '', email: '', city: '', password: '', conf_password: ''
    });
    const [errors, setErrors] = useState({});

    const { fullname, police_id, contact, email, city, password, conf_password } = formData;

    const validate = () => {
        let tempErrors = {};
        tempErrors.fullname = fullname ? "" : "Please enter your full name.";
        if (fullname && !/^[a-zA-Z\s]+$/.test(fullname)) {
            tempErrors.fullname = "Only alphabets are allowed.";
        }
        tempErrors.police_id = police_id.length === 8 ? "" : "Police ID must be exactly 8 characters.";
        tempErrors.contact = contact.length === 10 && /^\d+$/.test(contact) ? "" : "Contact number must be exactly 10 digits.";
        tempErrors.email = /\S+@\S+\.\S+/.test(email) ? "" : "Please enter a valid email address.";
        tempErrors.city = city ? "" : "Please select your city/district.";
        tempErrors.password = password.length === 8 ? "" : "Password must be exactly 8 characters long.";
        tempErrors.conf_password = conf_password === password ? "" : "Passwords do not match.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const onChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'fullname' ? value.toUpperCase() : value
        });
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (validate()) {
            try {
                const newUser = { fullname, police_id, contact, email, city, password };
                const res = await axios.post('http://localhost:5000/api/auth/register', newUser);
                alert(res.data.msg);
                navigate('/login');
            } catch (err) {
                alert(err.response.data.msg || 'Error registering');
            }
        }
    };

    return (
        <>
            <header className="d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#000', color: 'white' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '100px', width: '100px', marginRight: '15px' }} />
                <h1>Police Registration Portal</h1>
            </header>
            <div className="container mt-5">
                <div className="col-md-6 mx-auto">
                    <h3 className="text-center">User Register</h3>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="mb-3"><label className="form-label">Full Name</label><input type="text" name="fullname" className={`form-control ${errors.fullname ? 'is-invalid' : ''}`} style={{ textTransform: 'uppercase' }} value={fullname} onChange={onChange} placeholder="Enter your full name" />{errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}</div>
                        <div className="mb-3"><label className="form-label">Police ID Number</label><input type="text" name="police_id" className={`form-control ${errors.police_id ? 'is-invalid' : ''}`} value={police_id} onChange={onChange} placeholder="Enter your Police ID Number" />{errors.police_id && <div className="invalid-feedback">{errors.police_id}</div>}</div>
                        <div className="mb-3"><label className="form-label">Contact Number</label><input type="text" name="contact" className={`form-control ${errors.contact ? 'is-invalid' : ''}`} value={contact} onChange={onChange} placeholder="Enter your contact number" />{errors.contact && <div className="invalid-feedback">{errors.contact}</div>}</div>
                        <div className="mb-3"><label className="form-label">Email Address</label><input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={onChange} placeholder="Enter your email" />{errors.email && <div className="invalid-feedback">{errors.email}</div>}</div>
                        <div className="mb-3"><label className="form-label">City / District</label><select name="city" className={`form-select ${errors.city ? 'is-invalid' : ''}`} value={city} onChange={onChange}><option value="">Select your city/district</option><option>Ahmedabad</option><option>Amreli</option><option>Anand</option><option>Aravalli</option><option>Banaskantha</option><option>Bharuch</option><option>Bhavnagar</option><option>Botad</option><option>Chhota Udaipur</option><option>Dahod</option><option>Dang</option><option>Devbhoomi Dwarka</option><option>Gandhinagar</option><option>Gir Somnath</option><option>Jamnagar</option><option>Junagadh</option><option>Kheda</option><option>Kutch</option><option>Mahisagar</option><option>Mehsana</option><option>Morbi</option><option>Narmada</option><option>Navsari</option><option>Panchmahal</option><option>Patan</option><option>Porbandar</option><option>Rajkot</option><option>Sabarkantha</option><option>Surat</option><option>Surendranagar</option><option>Tapi</option><option>Vadodara</option><option>Valsad</option></select>{errors.city && <div className="invalid-feedback">{errors.city}</div>}</div>
                        <div className="mb-3"><label className="form-label">Password</label><input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={onChange} placeholder="Create a password" />{errors.password && <div className="invalid-feedback">{errors.password}</div>}</div>
                        <div className="mb-3"><label className="form-label">Confirm Password</label><input type="password" name="conf_password" className={`form-control ${errors.conf_password ? 'is-invalid' : ''}`} value={conf_password} onChange={onChange} placeholder="Confirm your password" />{errors.conf_password && <div className="invalid-feedback">{errors.conf_password}</div>}</div>
                        {/* Link to the terms and conditions page for user agreement */}
                        <div className="mb-3 form-check"><input type="checkbox" name="term_of_use" className="form-check-input" required /><label className="form-check-label">I accept the <Link to="/terms">Terms and Conditions</Link></label></div>
                        <p>Already have an account? <Link to="/login">Login here</Link>.</p>
                        
                        <button type="submit" className="btn btn-dark w-100 mt-3">Register</button>
                    </form>
                </div>
            </div>
            <div style={{ height: '24px' }} />
            <Footer />
        </>
    );
};

export default RegisterPage;