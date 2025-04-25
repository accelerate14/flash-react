import React, { useEffect, useState } from 'react';
import { fetchEmployees } from '../services/api';
import EmployeeCard from '../components/EmployeeCard';
import NewEmployeeCard from '../components/NewEmployeeCard';
import Filters from '../components/Filters';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [userAllocations, setUserAllocations] = useState({});
  const [filters, setFilters] = useState({});
  const [uniqueData, setUniqueData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchEmployees();
      if (response.status === 200) {
        const data = response.data;
        const allocations = {};
        const grouped = {};
        const locations = new Set();
        const participationTypes = new Set();
        const groupCodes = new Set();
        const clients = new Set();

        data.forEach(user => {
          if (!allocations[user.EmployeeID]) {
            allocations[user.EmployeeID] = 0;
            grouped[user.EmployeeID] = [];
          }
          allocations[user.EmployeeID] += user.Total_Allocation;
          grouped[user.EmployeeID].push(user);
          locations.add(user.LOCATION_CONCAT);
          participationTypes.add(user.PARTICIPATION_TYPE);
          groupCodes.add(user.C_GROUP_CODE);
          clients.add(user.C_ASSIGNED_CLIENT);
        });

        setEmployees(Object.values(grouped));
        setUserAllocations(allocations);
        setUniqueData({
          locations: [...locations],
          participationTypes: [...participationTypes],
          groupCodes: [...groupCodes],
          clients: [...clients]
        });
      }
    };

    loadData();
  }, []);

  const filteredEmployees = employees.filter(userRecords => {
    const user = userRecords[0];
    const nameMatch = !filters.name || `${user.FIRST_NAME} ${user.LAST_NAME}`.toLowerCase().includes(filters.name.toLowerCase());
    const statusMatch = !filters.status || user.Employee_Status.toLowerCase() === filters.status.toLowerCase();
    // Add more filters as needed...

    return nameMatch && statusMatch;
  });

  return (
    <div>
      <Filters setFilters={setFilters} uniqueData={uniqueData} />
      <div className="user-container">
        <NewEmployeeCard />
        {filteredEmployees.length ? (
          filteredEmployees.map((records, idx) => (
            <EmployeeCard key={idx} records={records} totalAllocation={userAllocations[records[0].EmployeeID]} />
          ))
        ) : (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No coincidence found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
