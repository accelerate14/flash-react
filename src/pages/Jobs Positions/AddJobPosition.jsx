import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../componentsNavbar';
import './styles.css';

const AddJobPosition = () => {
  const [jobPositionID, setJobPositionID] = useState('');
  const [jobPositionName, setJobPositionName] = useState('');
  const navigate = useNavigate();

 
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  const handleAddJobPosition = async () => {
    if (jobPositionID.trim() === '' || jobPositionName.trim() === '') {
      alert('Please enter both job position ID and name.');
      return;
    }

    const newJobPosition = {
      JobPositionID: jobPositionID,
      JOBPOSITION: jobPositionName,
    };

    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_JobPosition',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newJobPosition),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Job position added successfully!');
        navigate('/jobpositions'); // adjust based on your route
      } else {
        alert('Failed to add job position. Please try again.');
      }
    } catch (error) {
      console.error('Error adding job position:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="form-container">
        <h2>Add New Job Position</h2>
        <div className="form-group">
          <label htmlFor="jobposition-id">Job Position ID</label>
          <input
            type="text"
            id="jobposition-id"
            placeholder="Enter job position ID"
            value={jobPositionID}
            onChange={(e) => setJobPositionID(e.target.value)}
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
          <button id="add-jobposition-button" onClick={handleAddJobPosition}>
            Add Job Position
          </button>
        </div>
      </div>
    </>
  );
};

export default AddJobPosition;
