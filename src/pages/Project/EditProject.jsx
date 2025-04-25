import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EditProject = () => {
  const [searchParams] = useSearchParams();
  const projectID = searchParams.get('ProjectID');
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

  useEffect(() => {
    if (projectID) {
      fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Project?ProjectID=${projectID}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 200 && data.data && data.data.length > 0) {
            const project = data.data[0];
            setGroupCode(project.C_GROUP_CODE);
            setAssignedClient(project.C_ASSIGNED_CLIENT);
          } else {
            alert('Failed to load project data. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error fetching project data:', error);
          alert('Failed to load project data. Please try again.');
        });
    }
  }, [projectID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProject = {
      ProjectID: projectID,
      C_GROUP_CODE: groupCode,
      C_ASSIGNED_CLIENT: assignedClient
    };

    try {
      const response = await fetch(
        `https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Project/${projectID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProject)
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        alert('Project updated successfully!');
        navigate('/projects'); // Adjust route as needed
      } else {
        alert('Failed to update project. Please try again.');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project-id">Project ID</label>
          <input
            type="text"
            id="project-id"
            value={projectID || ''}
            readOnly
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
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
