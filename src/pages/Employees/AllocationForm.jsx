import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';

const AllocationForm = ({ allocation, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({ ...allocation });

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/${endpoint}`);
      const data = await response.json();
      return data.status === 200 ? data.data : [];
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  };
  

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          departmentData,
          jobPositionData,
          locationData,
          participationData,
          projectData,
          managerData
        ] = await Promise.all([
          fetchData('Dim_Department'),
          fetchData('Dim_JobPosition'),
          fetchData('Dim_Location'),
          fetchData('Dim_Participation'),
          fetchData('Dim_Project'),
          fetchData('Dim_Employee?IsManager=1&Employee_Status=ACTIVE'),
        ]);
        setDepartments(departmentData || []);
        setJobPositions(jobPositionData || []);
        setLocations(locationData || []);
        setParticipations(participationData || []);
        setProjects(projectData || []);
        setManagers(managerData || []);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (parseFloat(formData.ALLOCATION) > 100) {
      alert('Allocation cannot be greater than 100%');
      return;
    }

    if (!formData.C_SOW_Start || !formData.C_SOW_End) {
      alert('Please fill in both start and end dates.');
      return;
    }

    const payload = {
      ...formData,
      IsLegacy: "0",
      C_SOW_Start: formData.C_SOW_Start.replace(/-/g, ''),
      C_SOW_End: formData.C_SOW_End.replace(/-/g, '')
    };

    try {
      const res = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Fact_Employee_Allocation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const result = await res.json();
      if (result.status === 200) {
        alert('Allocation updated successfully');
        window.location.reload();
      } else {
        console.error(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{formData.AllocationID ? 'Edit Allocation' : 'Create Allocation'}</h2>

      <TextField label="Allocation ID" value={formData.AllocationID || ''} disabled fullWidth className="mb-4" />
      <TextField label="Employee ID" value={formData.EmployeeID || ''} disabled fullWidth className="mb-4" />

      <TextField
        select
        label="Reporting Manager"
        name="ReportingManagerID"
        value={formData.ReportingManagerID || ''}
        onChange={handleChange}
        fullWidth
        className="mb-4"
      >
        {managers.map(m => (
          <MenuItem key={m.EmployeeID} value={m.EmployeeID}>
            {m.FIRST_NAME} {m.LAST_NAME}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Department"
        name="DepartmentID"
        value={formData.DepartmentID || ''}
        onChange={handleChange}
        fullWidth
        className="mb-4"
      >
        {departments.map(d => (
          <MenuItem key={d.DepartmentID} value={d.DepartmentID}>{d.DEPARTMENT}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Job Position"
        name="JobPositionID"
        value={formData.JobPositionID || ''}
        onChange={handleChange}
        fullWidth
        className="mb-4"
      >
        {jobPositions.map(j => (
          <MenuItem key={j.JobPositionID} value={j.JobPositionID}>{j.JOBPOSITION}</MenuItem>
        ))}
      </TextField>

      {/* ... other dropdowns follow the same pattern */}
      
      <TextField
        label="Allocation (%)"
        name="ALLOCATION"
        type="number"
        value={formData.ALLOCATION || ''}
        onChange={handleChange}
        fullWidth
        inputProps={{ min: 1, max: 100 }}
        className="mb-4"
      />

      <TextField
        label="Comments"
        name="COMMENTS"
        value={formData.COMMENTS || ''}
        onChange={handleChange}
        fullWidth
        className="mb-4"
      />

      <TextField
        label="C SOW Start"
        name="C_SOW_Start"
        type="date"
        value={formData.C_SOW_Start || ''}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        className="mb-4"
      />

      <TextField
        label="C SOW End"
        name="C_SOW_End"
        type="date"
        value={formData.C_SOW_End || ''}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        className="mb-4"
      />

      <div className="flex justify-between">
        <Button variant="contained" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default AllocationForm;
