import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'
const AddParticipation = () => {
  const [participationID, setParticipationID] = useState('');
  const [participationType, setParticipationType] = useState('');
  const navigate = useNavigate();


   
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);
  const handleSubmit = async () => {
    if (participationID.trim() === '' || participationType.trim() === '') {
      alert('Please enter both participation ID and type.');
      return;
    }

    const newParticipation = {
      ParticipationID: participationID,
      PARTICIPATION_TYPE: participationType,
    };

    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Participation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newParticipation),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Participation added successfully!');
        navigate('/participations'); // or replace with 'index.html' route
      } else {
        alert('Failed to add participation. Please try again.');
      }
    } catch (error) {
      console.error('Error adding participation:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Participation</h2>
      <div className="form-group">
        <label htmlFor="participation-id">Participation ID</label>
        <input
          type="text"
          id="participation-id"
          placeholder="Enter participation ID"
          value={participationID}
          onChange={(e) => setParticipationID(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="participation-type">Participation Type</label>
        <input
          type="text"
          id="participation-type"
          placeholder="Enter participation type"
          value={participationType}
          onChange={(e) => setParticipationType(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button onClick={handleSubmit}>Add Participation</button>
      </div>
    </div>
  );
};

export default AddParticipation;
