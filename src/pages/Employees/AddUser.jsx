import React, { useRef } from 'react';
import axios from 'axios';

const AddUser = () => {
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await axios.post(
        'https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Employee',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 200) {
        alert('Employee added successfully');
        window.location.href = '/'; // If using React Router, we can use navigate('/')
      } else {
        alert('Error adding employee: ' + response.data.message);
        console.error('Error:', response.data);
      }
    } catch (error) {
      alert('Error adding employee: ' + error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Employee</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employee-id" className="block font-medium">Employee ID:</label>
          <input type="text" id="employee-id" name="EmployeeID" required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="first-name" className="block font-medium">First Name:</label>
          <input type="text" id="first-name" name="FIRST_NAME" required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="last-name" className="block font-medium">Last Name:</label>
          <input type="text" id="last-name" name="LAST_NAME" required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="hire-date" className="block font-medium">Hire Date:</label>
          <input type="date" id="hire-date" name="HIRE_DATE" required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label htmlFor="status" className="block font-medium">Status:</label>
          <select id="status" name="Employee_Status" required className="w-full border rounded px-3 py-2">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div>
          <label htmlFor="is-manager" className="block font-medium">Manager:</label>
          <select id="is-manager" name="IsManager" required className="w-full border rounded px-3 py-2">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AddUser;
