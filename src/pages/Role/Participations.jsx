import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography
} from '@mui/material';

const Participations = () => {
  const [participations, setParticipations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth/login');
    } else {
      fetchParticipations();
    }
  }, [navigate]);

  const fetchParticipations = async () => {
    try {
      const response = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Participation'
      );
      const data = await response.json();

      if (data.status === 200 && data.data) {
        setParticipations(data.data);
      } else {
        setError('Invalid API response.');
      }
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to load participations. Please try again later.');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  const filteredParticipations = participations.filter((p) =>
    p.PARTICIPATION_TYPE.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Filter Sidebar */}
      <aside className="fixed top-4 w-full md:w-52 h-[calc(100vh-2rem)] flex flex-col gap-4 pt-30 px-4 pb-6 bg-[#e2f4ff] overflow-y-auto rounded-2xl shadow-lg border border-gray-200">
        
        {/* Participation Field */}
        <div>
          <label htmlFor="participation-input" className="block mb-1 font-semibold text-gray-700">
            Participation Type
          </label>
          <p className="text-sm text-gray-500 mb-1">Search by Participation Type</p>
          <input
            type="text"
            id="participation-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          onClick={() => navigate('/add-participation')}
          className="w-full border border-gray-300 bg-white rounded-2xl shadow-lg px-3 py-2 focus:outline-none"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          Add New Participation
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
          {error ? (
            <Typography color="error" align="center" sx={{ fontWeight: 'bold', py: 2 }}>
              {error}
            </Typography>
          ) : filteredParticipations.length === 0 ? (
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
                  <TableCell><strong>Participation Type</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredParticipations.map((participation) => (
                  <TableRow key={participation.ParticipationID}>
                    <TableCell>{participation.PARTICIPATION_TYPE}</TableCell>
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
                          navigate(`/edit-participation/${participation.ParticipationID}`)
                        }
                      >
                        Edit Participation
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

export default Participations;
