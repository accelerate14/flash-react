import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css"
// import Navbar from '../navbar/Navbar';

const AddDepartment = () => {
  const [departmentID, setDepartmentID] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const navigate = useNavigate();

 

  useEffect(() => {    
      // localStorage.getItem('authToken');
      const token =localStorage.getItem('authToken') ;
      if (!token) {
        navigate('/auth/login'); // Adjust path as needed
      }
    }, [navigate]);

  const handleAddDepartment = () => {
    if (departmentID.trim() === '' || departmentName.trim() === '') {
      alert('Please enter both department ID and name.');
      return;
    }

    const newDepartment = {
      DepartmentID: departmentID,
      DEPARTMENT: departmentName,
    };

    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDepartment),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert('Department added successfully!');
          navigate('/'); // Redirect after success
        } else {
          alert('Failed to add department. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error adding department:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="form-container">
        <h2>Add New Department</h2>
        <div className="form-group">
          <label htmlFor="department-id">Department ID</label>
          <input
            type="text"
            id="department-id"
            placeholder="Enter department ID"
            value={departmentID}
            onChange={(e) => setDepartmentID(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="department-name">Department Name</label>
          <input
            type="text"
            id="department-name"
            placeholder="Enter department name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button onClick={handleAddDepartment}>Add Department</button>
        </div>
      </div>
    </>
  );
};

export default AddDepartment;
