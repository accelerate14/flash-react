import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import './styles.css';

const EditJobPosition = () => {
  const { JobPositionID } = useParams();
  const [jobPositionName, setJobPositionName] = useState('');
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
    const fetchJobPositionData = async () => {
      try {
        const response = await fetch(
          `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_JobPosition?JobPositionID=${JobPositionID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (data.status === 200 && data.data) {
          const jobPosition = data.data[0];
          setJobPositionName(jobPosition.JOBPOSITION);
        } else {
          alert('Failed to load job position data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching job position data:', error);
        alert('Failed to load job position data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPositionData();
  }, [JobPositionID]);

  const handleEditJobPosition = async () => {
    if (jobPositionName.trim() === '') {
      alert('Please enter a job position name.');
      return;
    }

    const updatedJobPosition = {
      JobPositionID,
      JOBPOSITION: jobPositionName,
    };

    try {
      const response = await fetch(
        `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_JobPosition/${JobPositionID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedJobPosition),
        }
      );

      const data = await response.json();
      if (data.status === 200) {
        alert('Job position updated successfully!');
        navigate('/jobpositions'); // update based on your route
      } else {
        alert('Failed to update job position. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job position:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="form-container">
        <h2>Edit Job Position</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="jobposition-id">Job Position ID</label>
              <input
                type="text"
                id="jobposition-id"
                value={JobPositionID}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobposition-name">Job Position Name</label>
              <input
                type="text"
                id="jobposition-name"
                placeholder="Enter job position name"
                value={jobPositionName}
                onChange={(e) => setJobPositionName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button id="edit-jobposition-button" onClick={handleEditJobPosition}>
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditJobPosition;
