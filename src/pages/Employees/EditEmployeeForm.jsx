import React, { useState, useEffect, useCallback } from 'react';
import {
    TextField, Button, FormControl, InputLabel, Select, MenuItem, styled
} from '@mui/material';

const HighlightedSelect = styled(Select)(({ theme }) => ({
    '& .MuiSelect-select': {
        backgroundColor: '#f8f864',
    },
}));

const EditEmployeeForm = ({ onSuccess, onCancel, employeeData }) => {
    const [formData, setFormData] = useState({
        FIRST_NAME: '',
        LAST_NAME: '',
        HIRE_DATE: '',
        Employee_Status: 'INACTIVE',
        IsManager: '0',
    });
    const API_BASE_URL = 'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api';

    useEffect(() => {
        if (employeeData) {
            setFormData({
                FIRST_NAME: employeeData.FIRST_NAME || '',
                LAST_NAME: employeeData.LAST_NAME || '',
                HIRE_DATE: employeeData.HIRE_DATE ? new Date(employeeData.HIRE_DATE).toISOString().split('T')[0] : '',
                Employee_Status: employeeData.Employee_Status || 'INACTIVE',
                IsManager: employeeData.IsManager ? '1' : '0',
            });
        }
    }, [employeeData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeData?.EmployeeID) {
            alert('Employee ID is not available for update.');
            return;
        }
        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/update/Dim_Employee/${employeeData.EmployeeID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    FIRST_NAME: employeeData.FIRST_NAME, // Keep original value
                    LAST_NAME: employeeData.LAST_NAME,   // Keep original value
                    HIRE_DATE: employeeData.HIRE_DATE ? new Date(employeeData.HIRE_DATE).toISOString().split('T')[0] : '', // Keep original value
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                alert('Employee data updated successfully');
                onSuccess();
            } else {
                console.error('Error updating data', data);
                alert('Failed to update employee data.');
            }
        } catch (err) {
            console.error('Error updating employee', err);
            alert('Error updating employee.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <FormControl fullWidth margin="normal">
                    First Name
                    <TextField
                        fullWidth
                        id="first-name"
                        name="FIRST_NAME"
                        value={formData.FIRST_NAME}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                    />
                </FormControl>
            </div>
            <div>
                <FormControl fullWidth margin="normal">
                    Last Name
                    <TextField
                        fullWidth
                        id="last-name"
                        name="LAST_NAME"
                        value={formData.LAST_NAME}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                    />
                </FormControl>
            </div>
            <div>
                <FormControl fullWidth margin="normal">
                    Hire Date
                    <TextField
                        fullWidth
                        type="date"
                        id="hire-date"
                        name="HIRE_DATE"
                        value={formData.HIRE_DATE}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>
            </div>
            <div>
                <FormControl fullWidth margin="normal">
                    Status
                    <HighlightedSelect
                        id="status"
                        name="Employee_Status"
                        value={formData.Employee_Status}
                        onChange={handleChange}
                    >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    </HighlightedSelect>
                </FormControl>
            </div>
            <div>
                <FormControl fullWidth variant="outlined" margin="normal">
                    Manager
                    <HighlightedSelect
                        labelId="is-manager-label"
                        id="is-manager"
                        name="IsManager"
                        value={formData.IsManager}
                        onChange={handleChange}
                        label="Manager"
                    >
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">No</MenuItem>
                    </HighlightedSelect>
                </FormControl>
            </div>
            <div className="mt-4">
                <button type='submit' className="text-white-600 bg-blue-600 font-medium py-2 px-4 mr-2">
                    Save Changes
                </button>
                <button onClick={onCancel} type='button' className="text-blue-600 font-medium py-2 px-4 mr-2">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditEmployeeForm;