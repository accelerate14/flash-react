import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [groupCodeQuery, setGroupCodeQuery] = useState('');
  const [assignedClientQuery, setAssignedClientQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


   
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);

  useEffect(() => {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Project')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200 && data.data) {
          setProjects(data.data);
        } else {
          console.error('Invalid API response:', data);
        }
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const name = `${project.C_GROUP_CODE} ${project.C_ASSIGNED_CLIENT}`.toLowerCase();
    return (
      name.includes(groupCodeQuery.toLowerCase()) &&
      name.includes(assignedClientQuery.toLowerCase())
    );
  });

  return (
    <div className="project-page">
      <div className="search-container">
        <div className="search-group">
          <label htmlFor="group-code-input">Search by Group Code</label>
          <input
            id="group-code-input"
            type="text"
            placeholder="Group Code"
            value={groupCodeQuery}
            onChange={(e) => setGroupCodeQuery(e.target.value)}
          />
        </div>
        <div className="search-group">
          <label htmlFor="assigned-client-input">Search by Assigned Client</label>
          <input
            id="assigned-client-input"
            type="text"
            placeholder="Assigned Client"
            value={assignedClientQuery}
            onChange={(e) => setAssignedClientQuery(e.target.value)}
          />
        </div>
        <div className="search-group">
          <button onClick={() => {
            setGroupCodeQuery('');
            setAssignedClientQuery('');
          }}>
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="project-container">
        <div
          className="new-project-card"
          onClick={() => navigate('/add-project')}
          style={{ cursor: 'pointer', padding: '1rem', background: '#f0f0f0', marginBottom: '1rem', textAlign: 'center' }}
        >
          Add New Project
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p id="no-results-message" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            No coincidence found
          </p>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.ProjectID} className="project-card">
              <h2>{project.C_GROUP_CODE}, {project.C_ASSIGNED_CLIENT}</h2>
              <div className="button-container" style={{ textAlign: 'center' }}>
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-project?ProjectID=${project.ProjectID}`)}
                >
                  Edit Project
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Project;
