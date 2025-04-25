import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./styles.css"
// import './'; // make sure this path is correct
// import Navbar from '../components/Navbar';

const EditDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentID, setDepartmentID] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const departmentIDFromURL = searchParams.get('DepartmentID');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // const token = true;
    if (!token) {
      navigate('/login');
      return;
    }

    if (departmentIDFromURL) {
      fetchDepartmentData(departmentIDFromURL);
    }
  }, [departmentIDFromURL, navigate]);

  const fetchDepartmentData = (id) => {
    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Department?DepartmentID=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200 && data.data) {
          const dept = data.data[0];
          setDepartmentID(dept.DepartmentID);
          setDepartmentName(dept.DEPARTMENT);
        } else {
          alert('Failed to load department data. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error fetching department data:', error);
        alert('Failed to load department data. Please try again.');
      });
  };

  const handleEdit = () => {
    if (departmentName.trim() === '') {
      alert('Please enter a department name.');
      return;
    }

    const updatedDepartment = {
      DepartmentID: departmentID,
      DEPARTMENT: departmentName,
    };

    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Department/${departmentID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDepartment),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          alert('Department updated successfully!');
          navigate('/');
        } else {
          alert('Failed to update department. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error updating department:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="form-container">
        <h2>Edit Department</h2>
        <div className="form-group">
          <label htmlFor="department-id">Department ID</label>
          <input
            type="text"
            id="department-id"
            value={departmentID}
            disabled
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
          <button onClick={handleEdit}>Save Changes</button>
        </div>
      </div>
    </>
  );
};

export default EditDepartment;
