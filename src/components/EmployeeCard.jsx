import React, { useState } from 'react';
import RecordItem from './RecordItem';

const EmployeeCard = ({ records, totalAllocation }) => {
  const [showAll, setShowAll] = useState(false);
  const user = records[0];
  const allocationStyle = {
    color: totalAllocation > 100 ? 'red' : totalAllocation < 100 ? 'orange' : 'green',
    borderColor: totalAllocation > 100 ? 'red' : totalAllocation < 100 ? 'orange' : 'green',
    borderWidth: '3px',
    borderStyle: 'solid',
  };

  return (
    <div className="user-card" style={user.Employee_Status === 'INACTIVE' ? { backgroundColor: '#D3D3D3' } : allocationStyle}>
      <h2>{user.FIRST_NAME} {user.LAST_NAME}</h2>
      <h3>Hire Date: {new Date(user.HIRE_DATE).toLocaleDateString()}</h3>
      <p className={`status ${user.Employee_Status.toLowerCase()}`}>Status: {user.Employee_Status}</p>
      <p style={{ ...allocationStyle }}>{`USER IS ${totalAllocation < 100 ? 'UNDER' : totalAllocation > 100 ? 'OVER' : 'FULLY'} ALLOCATED (${totalAllocation}%)`}</p>

      <RecordItem record={records[0]} index={1} />
      {showAll && records.slice(1).map((r, i) => <RecordItem key={i} record={r} index={i + 2} />)}

      {records.length > 1 && (
        <div className="button-container">
          <button onClick={() => setShowAll(prev => !prev)}>
            {showAll ? 'Hide' : 'Show More'}
          </button>
        </div>
      )}
      <div className="button-container">
        <button onClick={() => window.location.href = `edit.html?EmployeeID=${user.EmployeeID}`}>Edit Employee</button>
        <button onClick={() => window.location.href = `assignment.html?EmployeeID=${user.EmployeeID}`}>Assignments</button>
      </div>
    </div>
  );
};

export default EmployeeCard;
