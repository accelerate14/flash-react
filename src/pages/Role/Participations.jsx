import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'
const Participations = () => {
  const [participations, setParticipations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchParticipations();
  }, []);

 
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  const fetchParticipations = async () => {
    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Participation'
      );
      const data = await response.json();

      if (data.status === 200 && data.data) {
        setParticipations(data.data);
      } else {
        setError('Invalid API response.');
      }
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to load participations. Please try again later.');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  const filteredParticipations = participations.filter(p =>
    p.PARTICIPATION_TYPE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="participation-page">
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="participation-input">Search by Participation Type</label>
          <input
            type="text"
            id="participation-input"
            placeholder="Participation Type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-group">
          <button onClick={handleClearFilters}>Clear All Filters</button>
        </div>
      </div>

      <div className="participation-container">
        <div className="new-participation-card" onClick={() => navigate('/add-participation')}>
          Add New Participation
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {filteredParticipations.length === 0 && !error ? (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No coincidence found</p>
        ) : (
          filteredParticipations.map(participation => (
            <div className="participation-card" key={participation.ParticipationID}>
              <h2>{participation.PARTICIPATION_TYPE}</h2>
              <div className="button-container" style={{ textAlign: 'center' }}>
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-participation/${participation.ParticipationID}`)}
                >
                  Edit Participation
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Participations;
