import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from "./icons8-excel-48.png";
import pluslogo from "./icons8-plus-math-80.png";
import AddAllocation from './AddAllocation';
import AddAllocationOverlay from './AddAllocationOverlay';
import EditAllocationOverlay from './EditAllocationOverlay';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.status-active`]: {
        color: theme.palette.success.main,
    },
    [`&.status-inactive`]: {
        color: theme.palette.error.main,
    },
}));

const Assignments = () => {
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
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isAddAllocationOpen, setIsAddAllocationOpen] = useState(false);
    const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
    const [allocationToEdit, setAllocationToEdit] = useState(null);

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

    const handleDeleteAllocation = async (allocationId) => {
        if (window.confirm('Are you sure you want to delete this allocation?')) {
            try {
                const response = await fetchWithRetry(
                    `${API_BASE_URL}/update/Fact_Employee_Allocation/${allocationId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ IsLatest: "0", IsLegacy: "1" }),
                    }
                );
                const data = await response.json();
                if (data.status === 200) {
                    alert('Allocation deleted successfully');
                    fetchEmployeeAllocations(employeeId);
                } else {
                    console.error('Error deleting allocation:', data);
                    alert('Failed to delete allocation.');
                }
            } catch (err) {
                console.error('Error deleting allocation:', err);
                alert('Error deleting allocation.');
            }
        }
    };

    // const handleEditDatesClick = (allocation) => {
    //     setEditAllocation(allocation);
    // };

    const formatDateToYYYYMMDD = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const handleSaveEditedDates = async () => {
        if (!editAllocation?.AllocationID) return;
        if (!editAllocation?.C_SOW_Start || !editAllocation?.C_SOW_End) {
            alert('Please fill in both start and end dates.');
            return;
        }

        if (new Date(editAllocation.C_SOW_Start) > new Date(editAllocation.C_SOW_End)) {
            alert('Start date should be prior to the end date');
            return;
        }

        try {
            const updatedAllocation = {
                C_SOW_Start: formatDateToYYYYMMDD(editAllocation.C_SOW_Start),
                C_SOW_End: formatDateToYYYYMMDD(editAllocation.C_SOW_End),
            };

            const response = await fetchWithRetry(
                `${API_BASE_URL}/update/Fact_Employee_Allocation/${editAllocation.AllocationID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedAllocation),
                }
            );

            const data = await response.json();
            if (data.status === 200) {
                alert('Allocation dates updated successfully');
                setEditAllocation(null);
                fetchEmployeeAllocations(employeeId);
            } else {
                console.error('Error updating allocation dates:', data);
                alert('Failed to update allocation dates.');
            }
        } catch (err) {
            console.error('Error updating allocation dates:', err);
            alert('Error updating allocation dates.');
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



    const handleDownloadCSV = () => {
        const headers = [
            "Allocation ID",
            "Employee Full Name",
            "Reporting Manager",
            "Department",
            "Job Position",
            "Location",
            "Project",
            "Role Type",
            "Allocation (%)",
            "SOW Start",
            "SOW End"
        ];

        const rows = allocations.map((allocation) => [
            allocation.AllocationID,
            allocation.Employee_Full_Name,
            allocation.Reporting_Manager_Name,
            allocation.Department_Name,
            allocation.JobPosition_Name,
            allocation.Location_Reference,
            allocation.Project_Reference,
            allocation.Participation_Type_Reference,
            `${allocation.ALLOCATION}%`,
            formatDate(allocation.C_SOW_Start),
            formatDate(allocation.C_SOW_End)
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((row) =>
                    row
                        .map((value) =>
                            typeof value === "string" && value.includes(",")
                                ? `"${value}"`
                                : value
                        )
                        .join(",")
                )
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        // link.setAttribute("download", "allocations.csv");
        const fileName = allocations.length > 0
            ? `${allocations[0].Employee_Full_Name?.replace(/\s+/g, '_') || 'employee'}_allocations.csv`
            : 'employee_allocations.csv';
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const addallocation = () => {
        setIsOverlayOpen(true);
    };

    const handleAddAllocationClick = () => {
        setIsAddAllocationOpen(true);
    };

    const handleCloseAddAllocation = () => {
        setIsAddAllocationOpen(false);
    };

    const handleAddAllocationSuccess = () => {
        setIsAddAllocationOpen(false);
        fetchEmployeeAllocations(employeeId); // Refresh allocations on success
    };

    const handleEditDatesClick = (allocation) => {
        setAllocationToEdit(allocation);
        setIsEditAllocationOpen(true);
    };

    const handleCloseEditAllocation = () => {
        setIsEditAllocationOpen(false);
        setAllocationToEdit(null);
    };


    const handleEditAllocationSuccess = () => {
        setIsEditAllocationOpen(false);
        setAllocationToEdit(null);
        fetchEmployeeAllocations(employeeId); // Refresh allocations on success
    };


    return (

        <div className="container mx-auto p-4 min-h-screen">

            <div className='flex justify-center'>
                <p className='border rounded-md border-gray-400 p-3 text-gray-500 text-4xl mb-4'>Employee Allocation</p>
            </div>
            {/* <div className="bg-white shadow-md rounded-md p-6 mb-4">
                <Typography variant="h4" gutterBottom>{employee.FIRST_NAME} {employee.LAST_NAME}</Typography>
                <Typography variant="subtitle1" gutterBottom>Employee ID: {employee.EmployeeID}</Typography>
                <Typography variant="subtitle1" gutterBottom>Hire Date: {new Date(employee.HIRE_DATE).toLocaleDateString()}</Typography>
                <Typography variant="subtitle1" className={employee.Employee_Status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'} gutterBottom>
                    Status: {employee.Employee_Status}
                </Typography>
                {allocationAlert && (
                    <Typography variant="body1" className={allocationAlert.includes('OVER') ? 'text-red-500' : allocationAlert.includes('UNDER') ? 'text-orange-500' : 'text-green-500'} gutterBottom>
                        {allocationAlert}
                    </Typography>
                )}
                {employee.Employee_Status === 'ACTIVE' && (
                    // <Button variant="contained" color="primary" onClick={handleNewAllocationClick}>
                    //     New Allocation
                    // </Button>
                    <img
                        onClick={handleNewAllocationClick}
                        src={pluslogo}
                        alt="Logo"
                        className="h-8 w-8 cursor-pointer mr-30 p-[1px] rounded border border-gray-700 shadow-xl"
                    />
                )}
            </div> */}

            <Paper className="bg-white shadow-md rounded-md p-6 mb-4">
                <TableContainer>
                    <Table>
                        <TableHead className="bg-gray-200">
                            <TableRow>
                                <TableCell align="left">ID</TableCell>
                                <TableCell align="left">Full Name</TableCell>
                                <TableCell align="left">Hire Date</TableCell>
                                <TableCell align="left">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={employee?.EmployeeID}>
                                <TableCell align="left">{employee?.EmployeeID}</TableCell>
                                <TableCell align="left">{employee?.FIRST_NAME} {employee?.LAST_NAME}</TableCell>
                                <TableCell align="left">{new Date(employee?.HIRE_DATE).toLocaleDateString()}</TableCell>
                                <TableCell align="left" className={employee?.Employee_Status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
                                    {employee?.Employee_Status}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {allocationAlert && (
                    <Typography variant="body1" className={allocationAlert.includes('OVER') ? 'text-red-500' : allocationAlert.includes('UNDER') ? 'text-orange-500' : 'text-green-500'} gutterBottom>
                        {allocationAlert}
                    </Typography>
                )}
                {employee?.Employee_Status === 'ACTIVE' && (
                    <img
                        onClick={handleAddAllocationClick}
                        src={pluslogo}
                        alt="Add Allocation"
                        className="h-8 w-8 cursor-pointer mr-30 mt-3 p-[1px] rounded border border-gray-700 shadow-xl"
                    />
                )}
            </Paper>

            {isAddAllocationOpen && (
                <AddAllocationOverlay
                    open={isAddAllocationOpen}
                    onClose={handleCloseAddAllocation}
                    onSuccess={handleAddAllocationSuccess}
                />
            )}

            {isEditAllocationOpen && allocationToEdit && (
                <EditAllocationOverlay
                    open={isEditAllocationOpen}
                    onClose={handleCloseEditAllocation}
                    onSuccess={handleEditAllocationSuccess}
                    allocationData={allocationToEdit}
                />
            )}



            {/* {isOverlayOpen && (
                <div className="fixed inset-0 z-50 flex ">
                    
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setIsOverlayOpen(false)}
                    ></div>

                    
                    <div className="ml-auto w-full max-w-sm bg-white z-50 h-full p-6 animate-slide-in-right overflow-y-auto">

                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsOverlayOpen(false)}
                                className="text-gray-600 hover:text-black text-2xl"
                            >
                                X
                            </button>
                        </div>

                        <AddAllocation onSuccess={() => setIsOverlayOpen(false)} />
                    </div>
                </div>
            )} */}

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

            {editAllocation && (
                <div className="bg-white shadow-md rounded-md p-6 mb-4">
                    <Typography variant="h6" gutterBottom>Edit Allocation Dates</Typography>
                    <TextField fullWidth label="Allocation ID" value={editAllocation.AllocationID} disabled margin="normal" />
                    <TextField fullWidth label="Employee ID" value={editAllocation.EmployeeID} disabled margin="normal" />
                    <TextField fullWidth label="Reporting Manager" value={editAllocation.Reporting_Manager_Name} disabled margin="normal" />
                    <TextField fullWidth label="Department" value={editAllocation.Department_Name} disabled margin="normal" />
                    <TextField fullWidth label="Job Position" value={editAllocation.JobPosition_Name} disabled margin="normal" />
                    <TextField fullWidth label="Location" value={editAllocation.Location_Reference} disabled margin="normal" />
                    <TextField fullWidth label="Project ID" value={editAllocation.Project_Reference} disabled margin="normal" />
                    <TextField fullWidth label="Role Type" value={editAllocation.Participation_Type_Reference} disabled margin="normal" />
                    <TextField fullWidth label="Allocation (%)" value={editAllocation.ALLOCATION} disabled margin="normal" />
                    <TextField fullWidth label="Comments" value={editAllocation.COMMENTS} disabled margin="normal" />
                    <TextField
                        fullWidth
                        label="C SOW Start"
                        type="date"
                        value={editAllocation.C_SOW_Start ? editAllocation.C_SOW_Start.split('T')[0] : ''}
                        onChange={(e) => setEditAllocation(prev => ({ ...prev, C_SOW_Start: e.target.value }))}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="C SOW End"
                        type="date"
                        value={editAllocation.C_SOW_End ? editAllocation.C_SOW_End.split('T')[0] : ''}
                        onChange={(e) => setEditAllocation(prev => ({ ...prev, C_SOW_End: e.target.value }))}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />

                    <div className="mt-4">
                        <Button variant="contained" color="primary" onClick={handleSaveEditedDates} className="mr-2">
                            Save Dates
                        </Button>
                        <Button variant="outlined" onClick={() => setEditAllocation(null)}>
                            Close
                        </Button>

                    </div>
                </div>
            )}

            <img
                onClick={handleDownloadCSV}
                src={logo}
                alt="Logo"
                className="h-8 w-8 cursor-pointer mr-5 mb-3 p-[1px] rounded border border-gray-400 shadow-md"
            />
            <Paper className="shadow-md">
                <TableContainer>
                    <Table>
                        <TableHead className="bg-gray-200">
                            <TableRow>
                                <TableCell align="left">Allocation ID</TableCell>
                                <TableCell align="left">Employee Full Name</TableCell>
                                <TableCell align="left">Reporting Manager</TableCell>
                                <TableCell align="left">Department</TableCell>
                                <TableCell align="left">Job Position</TableCell>
                                <TableCell align="left">Location</TableCell>
                                <TableCell align="left">Project</TableCell>
                                <TableCell align="left">Role Type</TableCell>
                                <TableCell align="left">Allocation (%)</TableCell>
                                <TableCell align="left">SOW Start</TableCell>
                                <TableCell align="left">SOW End</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allocations.map((allocation) => (
                                <TableRow key={allocation.AllocationID}>
                                    <TableCell align="left">{allocation.AllocationID}</TableCell>
                                    <TableCell align="left">{allocation.Employee_Full_Name}</TableCell>
                                    <TableCell align="left">{allocation.Reporting_Manager_Name}</TableCell>
                                    <TableCell align="left">{allocation.Department_Name}</TableCell>
                                    <TableCell align="left">{allocation.JobPosition_Name}</TableCell>
                                    <TableCell align="left">{allocation.Location_Reference}</TableCell>
                                    <TableCell align="left">{allocation.Project_Reference}</TableCell>
                                    <TableCell align="left">{allocation.Participation_Type_Reference}</TableCell>
                                    <TableCell align="left">{allocation.ALLOCATION}%</TableCell>
                                    <TableCell align="left">{formatDate(allocation.C_SOW_Start)}</TableCell>
                                    <TableCell align="left">{formatDate(allocation.C_SOW_End)}</TableCell>
                                    <TableCell align="left">
                                        <button size="small" onClick={() => handleEditDatesClick(allocation)} className="text-blue-600 font-medium py-1 px-2 mr-2" >
                                            EDIT
                                        </button>
                                        <button size="small" color="error" onClick={() => handleDeleteAllocation(allocation.AllocationID)} className="text-blue-600 font-medium py-1 px-2 my-1">
                                            DELETE
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default Assignments;