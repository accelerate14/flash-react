import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Edit_Employee = () => {
  const { EmployeeID } = useParams(); // assuming you're using React Router
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    FIRST_NAME: '',
    LAST_NAME: '',
    HIRE_DATE: '',
    Employee_Status: '',
    IsManager: '0',
  });

  useEffect(() => {
    if (EmployeeID) fetchEmployeeData(EmployeeID);
  }, [EmployeeID]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};


  const fetchEmployeeData = (id) => {
    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Employee?EmployeeID=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && data.data?.length > 0) {
          const emp = data.data[0];
          setEmployee(emp);
          const date = formatDate(emp.HIRE_DATE)
          setFormData({
            FIRST_NAME: emp.FIRST_NAME,
            LAST_NAME: emp.LAST_NAME,
            HIRE_DATE: new Date(emp.HIRE_DATE).toISOString().split('T')[0],
            Employee_Status: emp.Employee_Status,
            IsManager: emp.IsManager ? '1' : '0',
          });
        } else {
          console.error('Invalid API response', data);
        }
      })
      .catch(err => console.error('Error fetching data', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Employee/${EmployeeID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          alert('Employee data updated successfully');
          navigate('/'); // Redirect to homepage or list page
        } else {
          console.error('Error updating data', data);
        }
      })
      .catch(err => console.error('Error updating employee', err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {employee && (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{employee.FIRST_NAME} {employee.LAST_NAME}</h2>
            <p className="text-sm text-gray-500">Employee ID: {employee.EmployeeID}</p>
            <p className="text-sm text-gray-500">Hire Date: {formatDate(employee.HIRE_DATE)}</p>
            <p className={`text-sm font-semibold mt-2 ${employee.Employee_Status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {employee.Employee_Status}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="first-name"
                name="FIRST_NAME"
                value={formData.FIRST_NAME}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="last-name"
                name="LAST_NAME"
                value={formData.LAST_NAME}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="hire-date" className="block text-sm font-medium text-gray-700">Hire Date</label>
              <input
                type="date"
                id="hire-date"
                name="HIRE_DATE"
                value={formData.HIRE_DATE}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="Employee_Status"
                value={formData.Employee_Status}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div>
              <label htmlFor="is-manager" className="block text-sm font-medium text-gray-700">Manager</label>
              <select
                id="is-manager"
                name="IsManager"
                value={formData.IsManager}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Edit_Employee;
