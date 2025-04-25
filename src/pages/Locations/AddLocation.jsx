import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css"
const AddLocation = () => {
  const [locationID, setLocationID] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();



    const locationData = {
      LocationID: locationID,
      LOCATIONCOUNTRY: country,
      LOCATIONCITY: city
    };

    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Location',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationData),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Location added successfully!');
        navigate('/');
      } else {
        alert('Failed to add location. Please try again.');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location. Please try again.');
    }
  };

  
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  return (
    <div className="form-container">
      <h2>Add New Location</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location-id">Location ID</label>
          <input
            type="text"
            id="location-id"
            value={locationID}
            onChange={(e) => setLocationID(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location-country">Country</label>
          <input
            type="text"
            id="location-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location-city">City</label>
          <input
            type="text"
            id="location-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Add Location</button>
        </div>
      </form>
    </div>
  );
};

export default AddLocation;
