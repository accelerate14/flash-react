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

const JobPosition = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_JobPosition')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setJobPositions(data.data || []);
        } else {
          setError('Invalid API response.');
        }
      })
      .catch(() => setError('Failed to load job positions.'));
  }, []);

  const filteredPositions = jobPositions.filter(pos =>
    pos.JOBPOSITION.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
    {/* Filter Sidebar */}
    <aside className="fixed top-4 w-full md:w-52 h-[calc(100vh-2rem)] flex flex-col gap-4 pt-30 px-4 pb-6 bg-[#e2f4ff] overflow-y-auto rounded-2xl shadow-lg border border-gray-200">
      
      {/* Job Position Field */}
      <div>
        <label htmlFor="jobposition-input" className="block mb-1 font-semibold text-gray-700">
          Job Position
        </label>
        <p className="text-sm text-gray-500 mb-1">Search by Job Position</p>
        <input
          id="jobposition-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // placeholder="Enter job position"
          className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        />
      </div>
  
      {/* Buttons */}
      <button
        onClick={() => setSearch('')}
        className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        Clear Filters
      </button>
  
      <button
        onClick={() => navigate('/add-jobposition')}
        className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        Add Job Position
      </button>
    </aside>
  
    {/* Table Content */}
    <div className="flex-1 pl-56 overflow-x-auto">
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        {filteredPositions.length === 0 && !error ? (
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
              <TableRow className='bg-gray-200'>
                <TableCell><strong>Job Position</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPositions.map((jobPosition) => (
                <TableRow key={jobPosition.JobPositionID}>
                  <TableCell>{jobPosition.JOBPOSITION}</TableCell>
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
                        navigate(`/edit-jobposition/${jobPosition.JobPositionID}`)
                      }
                    >
                      Edit Job Position
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

export default JobPosition;
