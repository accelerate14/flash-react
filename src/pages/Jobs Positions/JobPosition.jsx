import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobPosition = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


    
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  useEffect(() => {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_JobPosition')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setJobPositions(data.data || []);
        } else {
          setError('Invalid API response.');
        }
      })
      .catch(() => setError('Failed to load job positions.'));
  }, []);

  const filteredPositions = jobPositions.filter(pos =>
    pos.JOBPOSITION.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobposition-page">
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="jobposition-input">Search by Job Position</label>
          <input
            id="jobposition-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Job Position"
          />
        </div>
        <div className="search-group">
          <button onClick={() => setSearch('')}>Clear All Filters</button>
        </div>
      </div>

      <div className="jobposition-container">
        <div
          className="new-jobposition-card"
          onClick={() => navigate('/add-jobposition')}
        >
          Add New Job Position
        </div>

        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}

        {filteredPositions.length === 0 && !error ? (
          <p id="no-results-message" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            No coincidence found
          </p>
        ) : (
          filteredPositions.map((jobPosition) => (
            <div key={jobPosition.JobPositionID} className="jobposition-card">
              <h2>{jobPosition.JOBPOSITION}</h2>
              <div className="button-container" style={{ textAlign: 'center' }}>
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-jobposition/${jobPosition.JobPositionID}`)}
                >
                  Edit Job Position
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobPosition;
