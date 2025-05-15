import React, { useState, useEffect, useCallback } from 'react';
import {
    TextField, Select, MenuItem, FormControl, InputLabel, Typography, Button
} from '@mui/material';

const AddAllocationForm = ({ onSuccess, onCancel, employeeId }) => {
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
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [jobPositionOptions, setJobPositionOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [participationOptions, setParticipationOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [managerOptions, setManagerOptions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api';

    const fetchWithRetry = useCallback(async (url, options, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    return response;
                } else if (response.status !== 500) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error ${response.status}: ${errorText}`);
                }
            } catch (error) {
                console.warn(`Retrying request... (${i + 1}/${retries}) for URL: ${url} - Error: ${error.message}`);
                if (i === retries - 1) {
                    throw error;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
        throw new Error(`Failed to fetch data from ${url} after multiple attempts`);
    }, []);

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
                return [];
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }, [fetchWithRetry, API_BASE_URL]);

    const fetchDataForDropdowns = useCallback(async () => {
        setLoading(true);
        setError(null);
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
        } finally {
            setLoading(false);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchDataForDropdowns();
    }, [fetchDataForDropdowns]);

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
                onSuccess();
            } else {
                console.error('Error creating allocation:', data);
                alert('Failed to create allocation.');
            }
        } catch (err) {
            console.error('Error creating allocation:', err);
            alert('Error creating allocation.');
        }
    };

    if (loading) {
        return <div>Loading dropdown data...</div>;
    }

    if (error) {
        return <div>Error loading data: {error}</div>;
    }

    return (
        <div>
            {/* <Typography variant="h6" gutterBottom>Create New Allocation</Typography> */}
            <FormControl fullWidth margin="normal">
                <label id="reporting-manager-label">Reporting Manager</label>
                <Select
                    labelId="reporting-manager-label"
                    id="reporting-manager-id"
                    name="ReportingManagerID"
                    value={newAllocationData.ReportingManagerID}
                    onChange={handleInputChange}
                    required
                >
                    {managerOptions.map((manager) => (
                        <MenuItem key={manager.EmployeeID} value={manager.EmployeeID}>
                            {manager.FIRST_NAME} {manager.LAST_NAME}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="department-label">Department</label>
                <Select
                    labelId="department-label"
                    id="department-id"
                    name="DepartmentID"
                    value={newAllocationData.DepartmentID}
                    onChange={handleInputChange}
                    required
                >
                    {departmentOptions.map((dept) => (
                        <MenuItem key={dept.DepartmentID} value={dept.DepartmentID}>
                            {dept.DEPARTMENT}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="job-position-label">Job Position</label>
                <Select
                    labelId="job-position-label"
                    id="job-position-id"
                    name="JobPositionID"
                    value={newAllocationData.JobPositionID}
                    onChange={handleInputChange}
                    required
                >
                    {jobPositionOptions.map((job) => (
                        <MenuItem key={job.JobPositionID} value={job.JobPositionID}>
                            {job.JOBPOSITION}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="location-label">Location</label>
                <Select
                    labelId="location-label"
                    id="location-id"
                    name="LocationID"
                    value={newAllocationData.LocationID}
                    onChange={handleInputChange}
                    required
                >
                    {locationOptions.map((loc) => (
                        <MenuItem key={loc.LocationID} value={loc.LocationID}>
                            {loc.LOCATIONCOUNTRY}, {loc.LOCATIONCITY}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="project-label">Project</label>
                <Select
                    labelId="project-label"
                    id="project-id"
                    name="ProjectID"
                    value={newAllocationData.ProjectID}
                    onChange={handleInputChange}
                    required
                >
                    {projectOptions.map((proj) => (
                        <MenuItem key={proj.ProjectID} value={proj.ProjectID}>
                            {proj.C_ASSIGNED_CLIENT}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="role-type-label">Role Type</label>
                <Select
                    labelId="role-type-label"
                    id="role-type"
                    name="ParticipationID"
                    value={newAllocationData.ParticipationID}
                    onChange={handleInputChange}
                    required
                >
                    {participationOptions.map((part) => (
                        <MenuItem key={part.ParticipationID} value={part.ParticipationID}>
                            {part.PARTICIPATION_TYPE}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="role-type-label">Allocation</label>
                <TextField
                    fullWidth
                    // label="Allocation (%)"
                    type="number"
                    name="ALLOCATION"
                    value={newAllocationData.ALLOCATION}
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: 100 }}
                    // margin="normal"
                    required
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="role-type-label">Comments</label>
                <TextField
                    fullWidth
                    // label="Comments"
                    type="text"
                    name="COMMENTS"
                    value={newAllocationData.COMMENTS}
                    onChange={handleInputChange}
                    // margin="normal"
                    className='mb-4'
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="role-type-label">Start Date</label>
                <TextField
                    fullWidth
                    // label="C SOW Start"
                    type="date"
                    name="C_SOW_Start"
                    value={newAllocationData.C_SOW_Start}
                    onChange={handleInputChange}
                    // margin="normal"
                    required
                    labelProps={{ shrink: true }}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <label id="role-type-label">End Date</label>
                <TextField
                    fullWidth
                    // label="C SOW End"
                    type="date"
                    name="C_SOW_End"
                    value={newAllocationData.C_SOW_End}
                    onChange={handleInputChange}
                    // margin="normal"
                    required
                    labelProps={{ shrink: true }}
                />
            </FormControl>
            <div className="mt-4">
                <button type='button' onClick={handleSaveNewAllocation} className="text-white-600 bg-blue-600 font-medium py-2 px-4 mr-2">
                    Save Allocation
                </button>
                <button type='button' onClick={onCancel} className="text-blue-600 font-medium py-2 px-4 mr-2">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddAllocationForm;