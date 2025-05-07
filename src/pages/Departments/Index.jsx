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
 
<section className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Filter Sidebar */}

      <>
  <aside className="fixed top-4 w-full md:w-52 h-[calc(100vh-2rem)] flex flex-col gap-4 pt-30 px-4 pb-6 bg-[#e2f4ff] overflow-y-auto rounded-2xl shadow-lg border border-gray-200">
    
    {/* Department Field */}
    <div>
      <label htmlFor="department-input" className="block mb-1 font-semibold text-gray-700">
        Department
      </label>
      <p className="text-sm text-gray-500 mb-1">Search department</p>
      <input
        type="text"
        id="department-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      />
    </div>

    {/* Buttons */}
    <button
      onClick={handleClearFilters}
      className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      Clear Filters
    </button>

    <button
      onClick={() => navigate('/add-department')}
      className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      Add Department
    </button>
  </aside>
</>


      {/* Table Content */}
      <div className="flex-1 pl-56 overflow-x-auto">
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
                <TableRow className="bg-gray-200">
                  <TableCell><strong>Department Name</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments.map((dept) => (
                  <TableRow key={dept.DepartmentID}>
                    <TableCell>{dept.DEPARTMENT}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          px: 2,
                          py: 0.5,
                          fontSize: '0.875rem',
                          borderRadius: '6px',
                          backgroundColor: '#2563eb',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#1d4ed8'
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
      </div>
    </section>


  );
};

export default Index;
