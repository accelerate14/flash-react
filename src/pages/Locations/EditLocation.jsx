import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./styles.css";

const EditLocation = () => {
  const [searchParams] = useSearchParams();
  const locationID = searchParams.get('LocationID');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();
   
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  useEffect(() => {
    if (locationID) {
      fetch(
        `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Location?LocationID=${locationID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && data.data && data.data[0]) {
            const location = data.data[0];
            setCountry(location.LOCATIONCOUNTRY);
            setCity(location.LOCATIONCITY);
          } else {
            alert('Failed to load location data. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error fetching location data:', error);
          alert('Failed to load location data. Please try again.');
        });
    }
  }, [locationID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const locationData = {
      LocationID: locationID,
      LOCATIONCOUNTRY: country,
      LOCATIONCITY: city,
    };

    try {
      const response = await fetch(
        `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Location/${locationID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationData),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Location updated successfully!');
        navigate('/');
      } else {
        alert('Failed to update location. Please try again.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Location</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location-id">Location ID</label>
          <input
            type="text"
            id="location-id"
            value={locationID || ''}
            readOnly
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
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditLocation;
