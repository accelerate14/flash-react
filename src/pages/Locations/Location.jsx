import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import "./styles.css"
const Location = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [countryQuery, setCountryQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
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
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Location')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200 && data.data) {
          setLocations(data.data);
          setFilteredLocations(data.data);
        } else {
          setError('Invalid API response.');
        }
      })
      .catch((err) => {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
      });
  }, []);

  useEffect(() => {
    const filtered = locations.filter((loc) => {
      const name = `${loc.LOCATIONCITY}, ${loc.LOCATIONCOUNTRY}`.toLowerCase();
      return (
        name.includes(countryQuery.toLowerCase()) &&
        name.includes(cityQuery.toLowerCase())
      );
    });
    setFilteredLocations(filtered);
  }, [countryQuery, cityQuery, locations]);

  const handleClear = () => {
    setCountryQuery('');
    setCityQuery('');
  };

  return (
    <div className="p-4">
      <header id="navbar-container" />
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="country-input">Search by Country</label>
          <input
            type="text"
            id="country-input"
            placeholder="Country"
            value={countryQuery}
            onChange={(e) => setCountryQuery(e.target.value)}
          />
        </div>
        <div className="search-group">
          <label htmlFor="city-input">Search by City</label>
          <input
            type="text"
            id="city-input"
            placeholder="City"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
        </div>
        <div className="search-group">
          <button onClick={handleClear}>Clear All Filters</button>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div id="location-container" className="location-container">
        <div className="new-location-card" onClick={() => navigate('/addlocation')}>
          Add New Location
        </div>

        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <div key={location.LocationID} className="location-card">
              <h2>{`${location.LOCATIONCITY}, ${location.LOCATIONCOUNTRY}`}</h2>
              <div className="button-container" style={{ textAlign: 'center' }}>
                <button
                  className="edit-button"
                  onClick={() =>
                    navigate(`/editlocation?LocationID=${location.LocationID}`)
                  }
                >
                  Edit Location
                </button>
              </div>
            </div>
          ))
        ) : (
          <p id="no-results-message" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            No coincidence found
          </p>
        )}
      </div>
    </div>
  );
};

export default Location;
