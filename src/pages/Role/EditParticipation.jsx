import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css'
const EditParticipation = () => {
  const { ParticipationID } = useParams();
  const [participationType, setParticipationType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


 
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);
  useEffect(() => {
    const fetchParticipationData = async () => {
      try {
        const response = await fetch(
          `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Participation/ParticipationID=${ParticipationID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        console.log(data)
        if (data.status === 200 && data.data?.length > 0) {
          setParticipationType(data.data[0].PARTICIPATION_TYPE);
        } else {
          alert('Failed to load participation data.');
        }
      } catch (error) {
        console.error('Error fetching participation data:', error);
        alert('Failed to load participation data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (ParticipationID) {
      fetchParticipationData();
    }
  }, [ParticipationID]);

  const handleSubmit = async () => {
    if (participationType.trim() === '') {
      alert('Please enter a participation type.');
      return;
    }

    const updatedParticipation = {
      ParticipationID,
      PARTICIPATION_TYPE: participationType,
    };

    try {
      const response = await fetch(
        `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Participation/${ParticipationID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedParticipation),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Participation updated successfully!');
        navigate('/participations'); // adjust to your actual route
      } else {
        alert('Failed to update participation. Please try again.');
      }
    } catch (error) {
      console.error('Error updating participation:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Participation</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="participation-id">Participation ID</label>
            <input
              type="text"
              id="participation-id"
              value={ParticipationID}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="participation-type">Participation Type</label>
            <input
              type="text"
              id="participation-type"
              value={participationType}
              onChange={(e) => setParticipationType(e.target.value)}
              placeholder="Enter participation type"
            />
          </div>
          <div className="form-group">
            <button onClick={handleSubmit}>Save Changes</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditParticipation;
