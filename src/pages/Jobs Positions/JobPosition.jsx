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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label htmlFor="jobposition-input" className="block mb-1 font-semibold text-gray-700">
            Search by Job Position
          </label>
          <input
            id="jobposition-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Job Position"
            className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => setSearch('')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-gray-300 transition"
          >
            Clear Filters
          </button>
          <button
            onClick={() => navigate('/add-jobposition')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-blue-300 transition"
          >
            Add New Job Position
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center font-semibold py-2">{error}</p>
      )}

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
              <TableRow  className='bg-gray-200'>
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
    </section>
  );
};

export default JobPosition;
