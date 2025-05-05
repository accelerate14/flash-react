import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Typography
} from '@mui/material';

const Index = () => {
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth/login');
    } else {
      fetchDepartments();
    }
  }, [navigate]);

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

  const filteredDepartments = departments.filter((dept) =>
    dept.DEPARTMENT.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label htmlFor="department-input" className="block mb-1 font-semibold text-gray-700">
            Search by Department
          </label>
          <input
            type="text"
            id="department-input"
            placeholder="Department"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            id="clear-filters-button"
            onClick={handleClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-gray-300 transition"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => navigate('/add-department')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-green-300 transition"
          >
            Add New Department
          </button>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        {filteredDepartments.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ padding: 2, fontWeight: 'bold' }}
          >
            No coincidence found
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow  className='bg-gray-200'>
                <TableCell><strong>Department Name</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.DepartmentID} >
                  <TableCell>{dept.DEPARTMENT}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        px: 2, // equivalent to Tailwind px-4
                        py: 0.5, // equivalent to Tailwind py-1
                        fontSize: '0.875rem', // text-sm
                        borderRadius: '6px', // rounded
                        backgroundColor: '#2563eb', // bg-blue-600
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#1d4ed8' // hover:bg-blue-700
                        },
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                      onClick={() =>
                        navigate(`/edit-department?DepartmentID=${dept.DepartmentID}`)
                      }
                    >
                      Edit Department
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </section>
  );
};

export default Index;
