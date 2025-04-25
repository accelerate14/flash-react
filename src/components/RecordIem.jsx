import React from 'react';

const RecordItem = ({ record, index }) => (
  <div className="record-container">
    <h4>Record {index}</h4>
    <p>Participation Type: {record.PARTICIPATION_TYPE}</p>
    <p>Group Code: {record.C_GROUP_CODE}</p>
    <p>Assigned Client: {record.C_ASSIGNED_CLIENT}</p>
    <p>Allocation: {record.Total_Allocation}%</p>
    <p>Location: {record.LOCATION_CONCAT}</p>
  </div>
);

export default RecordItem;
