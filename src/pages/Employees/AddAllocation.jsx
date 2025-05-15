import React, { useRef, useState } from 'react';
import axios from 'axios';

const AddAllocation = () => {

  const { employeeId } = useParams();
  // console.log(employeeId)
  // const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [loadingAllocations, setLoadingAllocations] = useState(true);
  const [error, setError] = useState(null);
  const [newAllocationFormVisible, setNewAllocationFormVisible] = useState(false);
  const [editAllocation, setEditAllocation] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [jobPositionOptions, setJobPositionOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [participationOptions, setParticipationOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [newAllocationData, setNewAllocationData] = useState({
    EmployeeID: employeeId,
    ReportingManagerID: '',
    DepartmentID: '',
    JobPositionID: '',
    LocationID: '',
    ProjectID: '',
    ParticipationID: '',
    ALLOCATION: '',
    COMMENTS: '',
    C_SOW_Start: '',
    C_SOW_End: '',
  });
  const [allocationAlert, setAllocationAlert] = useState('');

  const API_BASE_URL = 'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };


  const fetchWithRetry = useCallback(async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) { // Check if the status code is in the 2xx range
          return response;
        } else if (response.status !== 500) {
          // If it's not a 500, don't retry as it's likely a client error or a permanent server error
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.warn(`Retrying request... (${i + 1}/${retries}) for URL: ${url} - Error: ${error.message}`);
        if (i === retries - 1) {
          throw error; // Re-throw the last error after all retries fail
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
    throw new Error(`Failed to fetch data from ${url} after multiple attempts`);
  }, []);



  const fetchEmployeeData = useCallback(async (id) => {
    setLoadingEmployee(true);
    setError(null);
    try {
      const response = await fetchWithRetry(
        `${API_BASE_URL}/select/Dim_Employee?EmployeeID=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.status === 200 && data.data && data.data.length > 0) {
        setEmployee(data.data[0]);
      } else {
        setError('Failed to load employee data.');
        console.error('Invalid API response:', data);
      }
    } catch (err) {
      setError('Error fetching employee data.');
      console.error('Error fetching employee data:', err);
    } finally {
      setLoadingEmployee(false);
    }
  }, [fetchWithRetry, API_BASE_URL]); // Ensure API_BASE_URL is in the dependency array



  const fetchEmployeeAllocations = useCallback(async (id) => {
    setLoadingAllocations(true);
    setError(null);
    try {
      const response = await fetchWithRetry(
        `${API_BASE_URL}/select/vw_Fact_Employee_Allocation_v2?EmployeeID=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.status === 200 && data.data) {
        setAllocations(data.data.reverse());
      } else {
        setAllocations([]);
        console.error('Invalid API response for allocations:', data);
      }
    } catch (err) {
      setAllocations([]);
      console.error('Error fetching employee allocations:', err);
    } finally {
      setLoadingAllocations(false);
    }
  }, [fetchWithRetry, API_BASE_URL]); // Ensure API_BASE_URL is in the dependency array


  const fetchData = useCallback(async (endpoint) => {
    try {
      const response = await fetchWithRetry(
        `${API_BASE_URL}/select/${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.status === 200 && data.data) {
        return data.data;
      } else {
        console.error(`Invalid API response for ${endpoint}:`, data);
        return []; // Consistent return of an array on failure
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return []; // Consistent return of an array on error
    }
  }, [fetchWithRetry, API_BASE_URL]); // Ensure API_BASE_URL is in the dependency array

  const fetchDataForDropdowns = useCallback(async () => {
    try {
      const [departmentData, jobPositionData, locationData, participationData, projectData, managerData] = await Promise.all([
        fetchData('Dim_Department'),
        fetchData('Dim_JobPosition'),
        fetchData('Dim_Location'),
        fetchData('Dim_Participation'),
        fetchData('Dim_Project'),
        fetchData('Dim_Employee?IsManager=1&Employee_Status=ACTIVE')
      ]);
      setDepartmentOptions(departmentData);
      setJobPositionOptions(jobPositionData);
      setLocationOptions(locationData);
      setParticipationOptions(participationData);
      setProjectOptions(projectData);
      setManagerOptions(managerData);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load dropdown data.');
    }
  }, [fetchData]);



  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
      fetchEmployeeAllocations(employeeId);
    }
    fetchDataForDropdowns();
  }, [employeeId, fetchEmployeeData, fetchEmployeeAllocations, fetchDataForDropdowns]);

  useEffect(() => {
    if (allocations.length > 0) {
      checkAllocationStatus();
    } else {
      setAllocationAlert('');
    }
  }, [allocations]);

  const handleNewAllocationClick = () => {
    setNewAllocationFormVisible(true);
    setEditAllocation(null);
    setNewAllocationData({
      EmployeeID: employeeId,
      ReportingManagerID: '',
      DepartmentID: '',
      JobPositionID: '',
      LocationID: '',
      ProjectID: '',
      ParticipationID: '',
      ALLOCATION: '',
      COMMENTS: '',
      C_SOW_Start: '',
      C_SOW_End: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAllocationData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveNewAllocation = async () => {
    if (!newAllocationData.ALLOCATION) {
      alert('Allocation field must not be empty');
      return;
    }
    if (parseFloat(newAllocationData.ALLOCATION) > 100) {
      alert('Allocation cannot be greater than 100%');
      return;
    }

    if (!newAllocationData.C_SOW_Start || !newAllocationData.C_SOW_End) {
      alert('Please fill in both start and end dates.');
      return;
    }

    if (newAllocationData.C_SOW_Start > newAllocationData.C_SOW_End) {
      alert('Please make sure start date is before the end dates.');
      return;
    }


    try {
      const payload = {
        ...newAllocationData,
        C_SOW_Start: newAllocationData.C_SOW_Start.replace(/-/g, ''),
        C_SOW_End: newAllocationData.C_SOW_End.replace(/-/g, ''),
        IsLegacy: "0"
      };
      const response = await fetchWithRetry(`${API_BASE_URL}/insert/Fact_Employee_Allocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === 200) {
        alert('Allocation created successfully');
        setNewAllocationFormVisible(false);
        fetchEmployeeAllocations(employeeId);
      } else {
        console.error('Error creating allocation:', data);
        alert('Failed to create allocation.');
      }
    } catch (err) {
      console.error('Error creating allocation:', err);
      alert('Error creating allocation.');
    }
  };


  const checkAllocationStatus = () => {
    console.log("All allocations:", allocations);
    const currentDate = new Date(); // Get the current date and time

    // Filter allocations where the end date is on or after the current date
    const activeAllocations = allocations.filter(alloc => {
      if (alloc.C_SOW_End) {
        const endDate = new Date(alloc.C_SOW_End);
        // Compare dates: endDate should be greater than or equal to currentDate
        return endDate >= currentDate;
      }
      // If there's no end date, consider it active (you might need to adjust this logic
      // based on how you handle open-ended allocations)
      return true;
    });

    console.log("Active allocations:", activeAllocations);

    const totalAllocation = activeAllocations.reduce(
      (sum, alloc) => sum + parseFloat(alloc.ALLOCATION || 0),
      0
    );

    if (totalAllocation > 100) {
      setAllocationAlert(`USER IS OVER ALLOCATED (Active: ${totalAllocation}%)`);
    } else if (totalAllocation < 100) {
      setAllocationAlert(`USER IS UNDER ALLOCATED (Active: ${totalAllocation}%)`);
    } else {
      setAllocationAlert(`USER IS FULLY ALLOCATED (Active: ${totalAllocation}%)`);
    }
  };

  if (loadingEmployee || loadingAllocations) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center py-8">Employee data not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-1 p-5 bg-white">
      {newAllocationFormVisible && (
        <div className="bg-white shadow-md rounded-md p-6 mb-4">
          <Typography variant="h6" gutterBottom>Create New Allocation</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="reporting-manager-label">Reporting Manager</InputLabel>
            <Select labelId="reporting-manager-label" id="reporting-manager-id" name="ReportingManagerID" value={newAllocationData.ReportingManagerID} onChange={handleInputChange} required>
              {managerOptions.map(manager => (
                <MenuItem key={manager.EmployeeID} value={manager.EmployeeID}>
                  {manager.FIRST_NAME} {manager.LAST_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="department-label">Department</InputLabel>
            <Select labelId="department-label" id="department-id" name="DepartmentID" value={newAllocationData.DepartmentID} onChange={handleInputChange} required>
              {departmentOptions.map(dept => (
                <MenuItem key={dept.DepartmentID} value={dept.DepartmentID}>
                  {dept.DEPARTMENT}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="job-position-label">Job Position</InputLabel>
            <Select labelId="job-position-label" id="job-position-id" name="JobPositionID" value={newAllocationData.JobPositionID} onChange={handleInputChange} required>
              {jobPositionOptions.map(job => (
                <MenuItem key={job.JobPositionID} value={job.JobPositionID}>
                  {job.JOBPOSITION}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="location-label">Location</InputLabel>
            <Select labelId="location-label" id="location-id" name="LocationID" value={newAllocationData.LocationID} onChange={handleInputChange} required>
              {locationOptions.map(loc => (
                <MenuItem key={loc.LocationID} value={loc.LocationID}>
                  {loc.LOCATIONCOUNTRY}, {loc.LOCATIONCITY}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="project-label">Project</InputLabel>
            <Select labelId="project-label" id="project-id" name="ProjectID" value={newAllocationData.ProjectID} onChange={handleInputChange} required>
              {projectOptions.map(proj => (
                <MenuItem key={proj.ProjectID} value={proj.ProjectID}>
                  {proj.C_ASSIGNED_CLIENT}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-type-label">Role Type</InputLabel>
            <Select labelId="role-type-label" id="role-type" name="ParticipationID" value={newAllocationData.ParticipationID} onChange={handleInputChange} required>
              {participationOptions.map(part => (
                <MenuItem key={part.ParticipationID} value={part.ParticipationID}>
                  {part.PARTICIPATION_TYPE}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Allocation (%)" type="number" name="ALLOCATION" value={newAllocationData.ALLOCATION} onChange={handleInputChange} inputProps={{ min: 1, max: 100 }} margin="normal" required />
          <TextField fullWidth label="Comments" type="text" name="COMMENTS" value={newAllocationData.COMMENTS} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="C SOW Start" type="date" name="C_SOW_Start" value={newAllocationData.C_SOW_Start} onChange={handleInputChange} margin="normal" required InputLabelProps={{ shrink: true }} />
          <TextField fullWidth label="C SOW End" type="date" name="C_SOW_End" value={newAllocationData.C_SOW_End} onChange={handleInputChange} margin="normal" required InputLabelProps={{ shrink: true }} />
          <div className="mt-4">
            <Button variant="contained" color="primary" onClick={handleSaveNewAllocation} className="mr-2">
              Save Allocation
            </Button>
            <Button variant="outlined" onClick={() => setNewAllocationFormVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAllocation;
