// pages/Employee.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialTable from '../components/MaterialTable';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const Example = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const rowsPerPage = 20;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: '',
    hireDateFrom: '',
    hireDateTo: '',
    status: '',
    allocation: '',
    location: '',
    participationType: '',
    groupCode: '',
    client: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      hireDateFrom: '',
      hireDateTo: '',
      status: '',
      allocation: '',
      location: '',
      participationType: '',
      groupCode: '',
      client: '',
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) navigate('/auth/login');
  }, [navigate]);

  useEffect(() => {
    axios
      .get('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/vw_Employee_Allocation_Summary')
      .then((res) => {
        if (res.data.status === 200) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const filterData = (data) => {
    const today = new Date();

    return data.filter((user) => {
      const fullName = `${user.FIRST_NAME ?? ''} ${user.LAST_NAME ?? ''}`.toLowerCase();
      const hireDate = new Date(user.HIRE_DATE);
      const sowEndDate = user.C_SOW_End ? new Date(user.C_SOW_End) : null;
      const from = filters.hireDateFrom ? new Date(filters.hireDateFrom) : null;
      const to = filters.hireDateTo ? new Date(filters.hireDateTo) : null;

      return (
        fullName.includes(filters.name.toLowerCase()) &&
        (!from || hireDate >= from) &&
        (!to || hireDate <= to) &&
        (!filters.status || user.Status === filters.status) &&
        (!filters.location || user.LOCATION_CONCAT === filters.location) &&
        (!filters.participationType || user.PARTICIPATION_TYPE === filters.participationType) &&
        (!filters.groupCode || user.C_GROUP_CODE === filters.groupCode) &&
        (!filters.client || user.C_ASSIGNED_CLIENT === filters.client) &&
        (!filters.allocation ||
          (filters.allocation === 'over' && (user.Total_Allocation ?? 0) > 100) ||
          (filters.allocation === 'under' && (user.Total_Allocation ?? 0) < 100) ||
          (filters.allocation === 'fully' && (user.Total_Allocation ?? 0) === 100)) &&
        (!sowEndDate || sowEndDate >= today)
      );
    });
  };

  useEffect(() => {
    const filtered = filterData(users);
    setFilteredUsers(filtered);
    setVisibleData(filtered.slice(0, rowsPerPage));
    setPage(1);
    setHasMore(filtered.length > rowsPerPage);
  }, [filters, users]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    const moreData = filteredUsers.slice(start, end);

    if (moreData.length === 0) {
      setHasMore(false);
      return;
    }

    setVisibleData((prev) => [...prev, ...moreData]);
    setPage(nextPage);
  };

  const downloadCSV = () => {
    const headers = [
      'FIRST_NAME', 'LAST_NAME', 'HIRE_DATE', 'Employee_Status', 'LOCATION_CONCAT',
      'PARTICIPATION_TYPE', 'C_GROUP_CODE', 'C_ASSIGNED_CLIENT',
      'C_SOW_Start', 'C_SOW_End', 'Total_Allocation',
    ];

    const formatDateOrNull = (dateStr) => {
      const d = new Date(dateStr);
      if (!dateStr || isNaN(d)) return 'null';
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${mm}/${dd}/${d.getFullYear()}`;
    };

    const csvRows = [
      headers.join(','),
      ...filteredUsers.map(u =>
        headers.map(h => {
          switch (h) {
            case 'HIRE_DATE':
            case 'C_SOW_Start':
            case 'C_SOW_End':
              return `"${formatDateOrNull(u[h])}"`;
            case 'Employee_Status':
              return `"${u[h] ?? 'ACTIVE'}"`;
            case 'LOCATION_CONCAT':
            case 'PARTICIPATION_TYPE':
            case 'C_GROUP_CODE':
            case 'C_ASSIGNED_CLIENT':
              return `"${u[h] ?? 'null'}"`;
            case 'Total_Allocation':
              return u[h] == null || u[h] === '' ? '0' : u[h];
            default:
              return `"${(u[h] ?? '').toString().replace(/"/g, '""')}"`;
          }
        }).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_list.csv';
    link.click();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <input id="name" type="text" placeholder="Search by Name" className="p-2 border rounded" value={filters.name} onChange={handleInputChange} />
        <input id="hireDateFrom" type="date" className="p-2 border rounded" value={filters.hireDateFrom} onChange={handleInputChange} />
        <input id="hireDateTo" type="date" className="p-2 border rounded" value={filters.hireDateTo} onChange={handleInputChange} />
        <select id="status" className="p-2 border rounded" value={filters.status} onChange={handleInputChange}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select id="allocation" className="p-2 border rounded" value={filters.allocation} onChange={handleInputChange}>
          <option value="">All Allocations</option>
          <option value="over">Over Allocated</option>
          <option value="under">Under Allocated</option>
          <option value="fully">Fully Allocated</option>
        </select>
        <select id="participationType" className="p-2 border rounded" value={filters.participationType} onChange={handleInputChange}>
          <option value="">All Participation Types</option>
          {[...new Set(users.map(u => u.PARTICIPATION_TYPE))].map(type => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select id="location" className="p-2 border rounded" value={filters.location} onChange={handleInputChange}>
          <option value="">All Locations</option>
          {[...new Set(users.map(u => u.LOCATION_CONCAT))].map(loc => (
            <option key={loc}>{loc}</option>
          ))}
        </select>
        <select id="groupCode" className="p-2 border rounded" value={filters.groupCode} onChange={handleInputChange}>
          <option value="">All Group Codes</option>
          {[...new Set(users.map(u => u.C_GROUP_CODE))].map(code => (
            <option key={code}>{code}</option>
          ))}
        </select>
        <select id="client" className="p-2 border rounded" value={filters.client} onChange={handleInputChange}>
          <option value="">All Clients</option>
          {[...new Set(users.map(u => u.C_ASSIGNED_CLIENT))].map(client => (
            <option key={client}>{client}</option>
          ))}
        </select>
        <button onClick={clearFilters} className="p-2 bg-red-500 text-black rounded">Clear Filters</button>
        <button onClick={downloadCSV} className="p-2 bg-green-500 text-black rounded">Download CSV</button>
      </div>

      <InfiniteScroll
        dataLength={visibleData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading more employees...</p>}
        endMessage={<p className="text-center py-4">No more employees</p>}
      >
        <MaterialTable users={visibleData} />
      </InfiniteScroll>
    </div>
  );
};

export default Example;  