import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  /* Component state for cases data, loading status and error handling */
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Fetch approved cases when component mounts */
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/cases');
        setCases(response.data);
      } catch (err) {
        setError('Failed to fetch cases.');
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  /* Conditional rendering based on loading and error states */
  if (loading) return <div className="container mt-4"><p>Loading cases...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Cases</h2>
      {cases.length > 0 ? (
        cases.map(caseItem => (
          <article key={caseItem._id} className="card mb-3">
            <div className="card-body">
              {/* Case title with navigation link to case details page */}
              <h3 className="card-title">
                <Link to={`/case/${caseItem._id}`}>{caseItem.case_title}</Link>
              </h3>
              <p className="card-text mb-1"><b>Handler:</b> {caseItem.case_handler}</p>
              <p className="card-text mb-1"><b>Date:</b> {new Date(caseItem.case_date).toLocaleDateString("en-GB").replace(/\//g, "-")}</p>
              <p className="card-text mb-1"><b>Status:</b> {caseItem.status}</p>
              <p className="card-text">{caseItem.case_description.substring(0, 150)}...</p>
              {/* Public view doesn't include administrative actions */}
            </div>
          </article>
        ))
      ) : (
        <div className="alert alert-info">No cases found.</div>
      )}
    </div>
  );
};

export default HomePage;
