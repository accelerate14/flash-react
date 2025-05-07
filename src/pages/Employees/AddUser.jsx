import React, { useRef, useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const formRef = useRef();
  const [showMore, setShowMore] = useState(false);

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
    <div className="max-w-xl mx-auto mt-1 p-5 bg-white">
    <h2 className="text-xl font-bold mb-1 text-center">Add New Employee</h2>
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

      {/* Toggle More fields */}
      {/* {!showMore && (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="text-blue-600"
        >
          More
        </button>
      )} */}

      {showMore && (
        <>
          <div>
            <label htmlFor="hire-date" className="block font-medium">Hire Date:</label>
            <input type="date" id="hire-date" name="HIRE_DATE" required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label htmlFor="status" className="block font-medium">Status:</label>
            <div className="relative">
              <select
                id="status"
                name="Employee_Status"
                required
                className="w-full border rounded px-3 py-2 appearance-none pr-10 text-gray-700"
              >
                <option value=""></option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <div className="pointer-events-none absolute  text-xs inset-y-0 right-2 flex items-center text-red-500">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="is-manager" className="block font-medium">Manager:</label>
            <div className="relative">
              <select
                id="is-manager"
                name="IsManager"
                required
                className="w-full border rounded px-3 py-2 appearance-none pr-10 text-gray-700"
              >
                <option value=""></option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <div className="pointer-events-none absolute text-xs   inset-y-0 right-2 flex items-center text-red-500">
                ▼
              </div>
            </div>
          </div>
        </>
      )}

      {/* Save and More button in a row */}
      <div className="flex justify-between items-center space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-black font-semibold py-2 px-4 rounded hover:bg-blue-700 flex-1"
        >
          Save
        </button>

        {!showMore && (
          <button
            type="button"
            onClick={() => setShowMore(true)}
            className="text-blue-600 font-medium py-2 px-4"
          >
            More
          </button>
        )}
      </div>
    </form>
  </div>
  );
};

export default AddUser;
