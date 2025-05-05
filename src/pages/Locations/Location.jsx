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

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [countryQuery, setCountryQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth/login');
    } else {
      fetchLocations();
    }
  }, [navigate]);

  const fetchLocations = async () => {
    try {
      const res = await fetch(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Location'
      );
      const data = await res.json();
      if (data.status === 200 && data.data) {
        setLocations(data.data);
        setFilteredLocations(data.data);
      } else {
        setError('Invalid API response.');
      }
    } catch {
      setError('Failed to load locations. Please try again later.');
    }
  };

  useEffect(() => {
    const filtered = locations.filter((loc) => {
      const fullText = `${loc.LOCATIONCITY}, ${loc.LOCATIONCOUNTRY}`.toLowerCase();
      return (
        fullText.includes(countryQuery.toLowerCase()) &&
        fullText.includes(cityQuery.toLowerCase())
      );
    });
    setFilteredLocations(filtered);
  }, [countryQuery, cityQuery, locations]);

  const handleClearFilters = () => {
    setCountryQuery('');
    setCityQuery('');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="country-input" className="block mb-1 font-semibold text-gray-700">
            Search by Country
          </label>
          <input
            type="text"
            id="country-input"
            value={countryQuery}
            onChange={(e) => setCountryQuery(e.target.value)}
            placeholder="Country"
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="city-input" className="block mb-1 font-semibold text-gray-700">
            Search by City
          </label>
          <input
            type="text"
            id="city-input"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="City"
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col justify-end gap-2">
          <button
            onClick={handleClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-gray-300 transition"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => navigate('/addlocation')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-green-300 transition"
          >
            Add New Location
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-600 font-medium mb-4">{error}</p>}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        {filteredLocations.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ padding: 2, fontWeight: 'bold' }}
          >
            No results found
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow  className='bg-gray-200'>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Country</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations.map((loc) => (
                <TableRow key={loc.LocationID}>
                  <TableCell>{loc.LOCATIONCITY}</TableCell>
                  <TableCell>{loc.LOCATIONCOUNTRY}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      // color="primary"
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
                        navigate(`/editlocation?LocationID=${loc.LocationID}`)
                      }
                    >
                      Edit Location
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

export default Location;
