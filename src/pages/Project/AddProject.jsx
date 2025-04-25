import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const [projectID, setProjectID] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [assignedClient, setAssignedClient] = useState('');
  const navigate = useNavigate();

 
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      ProjectID: projectID,
      C_GROUP_CODE: groupCode,
      C_ASSIGNED_CLIENT: assignedClient
    };

    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Project',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectData)
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Project added successfully!');
        navigate('/projects'); // Or wherever your index page is
      } else {
        alert('Failed to add project. Please try again.');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-id">Project ID</label>
          <input
            type="text"
            id="project-id"
            value={projectID}
            onChange={(e) => setProjectID(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="group-code">Group Code</label>
          <input
            type="text"
            id="group-code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="assigned-client">Assigned Client</label>
          <input
            type="text"
            id="assigned-client"
            value={assignedClient}
            onChange={(e) => setAssignedClient(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Add Project</button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
