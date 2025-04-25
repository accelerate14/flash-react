import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
import './styles.css';

const Index = () => {
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Department'
      );
      const data = await res.json();
      if (data.status === 200 && data.data) {
        setDepartments(data.data);
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
  };


  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  const filteredDepartments = departments.filter((dept) =>
    dept.DEPARTMENT.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* <Navbar /> */}
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="department-input">Search by Department</label>
          <input
            type="text"
            id="department-input"
            placeholder="Department"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="search-group">
          <button id="clear-filters-button" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      </div>

      <div id="department-container" className="department-container">
        <div
          className="new-department-card"
          onClick={() => navigate('/add-department')}
        >
          Add New Department
        </div>

        {filteredDepartments.length === 0 ? (
          <p
            id="no-results-message"
            style={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            No coincidence found
          </p>
        ) : (
          filteredDepartments.map((dept) => (
            <div className="department-card" key={dept.DepartmentID}>
              <h2>{dept.DEPARTMENT}</h2>
              <div className="button-container" style={{ textAlign: 'center' }}>
                <button
                  className="edit-button"
                  onClick={() =>
                    navigate(`/edit-department?DepartmentID=${dept.DepartmentID}`)
                  }
                >
                  Edit Department
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Index;
