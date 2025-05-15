// components/MaterialTable.jsx
import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Button
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import EditEmployeeOverlay from '../pages/Employees/EditEmployeeOverlay';

const MaterialTable = ({ users }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleCloseEditEmployee = () => {
    setIsEditEmployeeOpen(false);
    setEmployeeToEdit(null);
    // Optionally, you might want to refresh the user list here
    // if the changes should be immediately reflected in the table.
    // For now, we'll just close the overlay.
  };

  const handleEditEmployeeSuccess = () => {
    setIsEditEmployeeOpen(false);
    setEmployeeToEdit(null);
    // You might want to trigger a data refresh here
  };

  const handleNameClick = (employeeId) => {
    navigate(`/assignments/${employeeId}`); // Keep link to assignments
  };

  const formatDate = (dateString) => {
    if (dateString == "NULL") return 'NULL';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const paginationButtons = useMemo(() => {
    const buttons = [];
    const windowSize = 3;
    let startPage = Math.max(0, page - Math.floor(windowSize / 2));
    let endPage = Math.min(totalPages - 1, page + Math.floor((windowSize - 1) / 2));

    if (totalPages <= windowSize) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (startPage > 0) {
        buttons.push(0);
        if (startPage > 1) {
          buttons.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
          buttons.push('...');
        }
        buttons.push(totalPages - 1);
      }
    }
    return buttons;
  }, [page, totalPages]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleRows = useMemo(
    () =>
      users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, users],
  );

  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead className="bg-gray-200">
          <TableRow>
            <TableCell align="center">Employee ID</TableCell>
            <TableCell align="center">Full Name</TableCell>
            <TableCell align="center">Hire Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Location</TableCell>
            <TableCell align="center">Participation Type</TableCell>
            <TableCell align="center">Group Code</TableCell>
            <TableCell align="center">Client</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Date</TableCell>
            <TableCell align="center">Total Allocation (%)</TableCell>
            <TableCell align="center">Actions</TableCell> {/* New Header */}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((user, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <Link
                  to={`/assignments/${user.EmployeeID}`}
                  className="text-black hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  {user.EmployeeID ? user.EmployeeID : "NULL"}
                </Link>
              </TableCell>
              <TableCell align="center">{user.FIRST_NAME} {user.LAST_NAME}</TableCell>
              <TableCell align="center">{formatDate(user.HIRE_DATE)}</TableCell>
              <TableCell align="center">{user.Employee_Status ? user.Employee_Status : "INACTIVE"}</TableCell>
              <TableCell align="center">{user.LOCATION_CONCAT ? user.LOCATION_CONCAT : "NULL"}</TableCell>
              <TableCell align="center">{user.PARTICIPATION_TYPE ? user.PARTICIPATION_TYPE : "NOT ASSIGNED"}</TableCell>
              <TableCell align="center">{user.C_GROUP_CODE ? user.C_GROUP_CODE : "NULL"}</TableCell>
              <TableCell align="center">{user.C_ASSIGNED_CLIENT ? user.C_ASSIGNED_CLIENT : "NULL"}</TableCell>
              <TableCell align="center">{formatDate(user.C_SOW_Start ? user.C_SOW_Start : "NULL")}</TableCell>
              <TableCell align="center">{formatDate(user.C_SOW_End ? user.C_SOW_End : "NULL")}</TableCell>
              <TableCell align="center">{user.Total_Allocation ? user.Total_Allocation : "0"}%</TableCell>
              <TableCell align="center"> {/* Edit Button */}
                <button role="button" className="text-blue-600 font-medium outline-none py-2 px-4 mr-2" onClick={() => handleOpenEditEmployee(user)}>
                  EDIT
                </button>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={12} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[100, 200, 500, { label: 'All', value: -1 }]}
        colSpan={12}
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            'aria-label': 'rows per page',
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={() => <></>} // Remove default actions
      />
      <div className="flex justify-center mt-4 items-center">
        <IconButton
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          color="error"
        >
          <ArrowLeftIcon />
        </IconButton>
        {paginationButtons.map((button, index) => (
          <React.Fragment key={index}>
            {button === '...' ? (
              <span className="mx-2">...</span>
            ) : (
              <button
                onClick={() => setPage(button)}
                className={`px-3 py-1 mx-1 rounded-full ${page === button ? 'bg-gray-100 text-red-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                disabled={page === button}
              >
                {button + 1}
              </button>
            )}
          </React.Fragment>
        ))}
        <IconButton
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          color="error"
        >
          <ArrowRightIcon />
        </IconButton>
      </div>
      {isEditEmployeeOpen && employeeToEdit && (
        <EditEmployeeOverlay
          open={isEditEmployeeOpen}
          onClose={handleCloseEditEmployee}
          onSuccess={handleEditEmployeeSuccess}
          employeeData={employeeToEdit}
        />
      )}
    </TableContainer>
  );
};

export default MaterialTable;

// // components/MaterialTable.jsx
// // components/MaterialTable.jsx
// import React, { useState, useMemo } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   TablePagination
// } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { IconButton } from '@mui/material';
// import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';

// const MaterialTable = ({ users }) => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(100);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleNameClick = (employeeId) => {
//     navigate(`/edit/${employeeId}`);
//   };

//   const formatDate = (dateString) => {
//     if (dateString == "NULL") return 'NULL';
//     const date = new Date(dateString);
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}-${day}-${year}`;
//   };

//   const totalPages = Math.ceil(users.length / rowsPerPage);

//   const paginationButtons = useMemo(() => {
//     const buttons = [];
//     const windowSize = 3;
//     let startPage = Math.max(0, page - Math.floor(windowSize / 2));
//     let endPage = Math.min(totalPages - 1, page + Math.floor((windowSize - 1) / 2));

//     if (totalPages <= windowSize) {
//       for (let i = 0; i < totalPages; i++) {
//         buttons.push(i);
//       }
//     } else {
//       if (startPage > 0) {
//         buttons.push(0);
//         if (startPage > 1) {
//           buttons.push('...');
//         }
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         buttons.push(i);
//       }

//       if (endPage < totalPages - 1) {
//         if (endPage < totalPages - 2) {
//           buttons.push('...');
//         }
//         buttons.push(totalPages - 1);
//       }
//     }
//     return buttons;
//   }, [page, totalPages]);

//   const emptyRows =
//     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

//   const visibleRows = useMemo(
//     () =>
//       users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//     [page, rowsPerPage, users],
//   );

//   return (
//     <TableContainer component={Paper} className="shadow-md">
//       <Table>
//         <TableHead className="bg-gray-200">
//           <TableRow>
//             <TableCell align="center" >Employee ID</TableCell>
//             <TableCell align="center" >Full Name</TableCell>
//             <TableCell align="center" >Hire Date</TableCell>
//             <TableCell align="center" >Status</TableCell>
//             <TableCell align="center" >Location</TableCell>
//             <TableCell align="center" >Participation Type</TableCell>
//             <TableCell align="center" >Group Code</TableCell>
//             <TableCell align="center" >Client</TableCell>
//             <TableCell align="center" >Start Date</TableCell>
//             <TableCell align="center" >End Date</TableCell>
//             <TableCell align="center" >Total Allocation (%)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {visibleRows.map((user, index) => (
//             <TableRow key={index}>
//               <TableCell align="center" ><Link
//                 to={`/assignments/${user.EmployeeID}`}
//                 className="text-black hover:text-blue-800 font-medium transition-colors duration-200"
//               >{user.EmployeeID ? user.EmployeeID : "NULL"}</Link></TableCell>
//               <TableCell align="center"><Link
//                 to={`/edit/${user.EmployeeID}`}
//                 className="text-black hover:text-blue-800 font-medium transition-colors duration-200"
//               >
//                 {user.FIRST_NAME} {user.LAST_NAME}
//               </Link></TableCell>
//               <TableCell align="center" >{formatDate(user.HIRE_DATE)}</TableCell>
//               <TableCell align="center" >{user.Employee_Status ? user.Employee_Status : "INACTIVE"}</TableCell>
//               <TableCell align="center" >{user.LOCATION_CONCAT ? user.LOCATION_CONCAT : "NULL"}</TableCell>
//               <TableCell align="center" >{user.PARTICIPATION_TYPE ? user.PARTICIPATION_TYPE : "NOT ASSIGNED"}</TableCell>
//               <TableCell align="center" >{user.C_GROUP_CODE ? user.C_GROUP_CODE : "NULL"}</TableCell>
//               <TableCell align="center" >{user.C_ASSIGNED_CLIENT ? user.C_ASSIGNED_CLIENT : "NULL"}</TableCell>
//               <TableCell align="center" >{formatDate(user.C_SOW_Start ? user.C_SOW_Start : "NULL")}</TableCell>
//               <TableCell align="center" >{formatDate(user.C_SOW_End ? user.C_SOW_End : "NULL")}</TableCell>
//               <TableCell align="center" >{user.Total_Allocation ? user.Total_Allocation : "0"}%</TableCell>
//             </TableRow>
//           ))}

//           {emptyRows > 0 && (
//             <TableRow style={{ height: 53 * emptyRows }}>
//               <TableCell colSpan={12} />
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <TablePagination
//         rowsPerPageOptions={[100, 200, 500, { label: 'All', value: -1 }]}
//         colSpan={12}
//         count={users.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         SelectProps={{
//           inputProps: {
//             'aria-label': 'rows per page',
//           },
//           native: true,
//         }}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         ActionsComponent={() => <></>} // Remove default actions
//       />
//       <div className="flex justify-center mt-4 items-center">
//         {/* <button
//           onClick={() => setPage(Math.max(0, page - 1))}
//           disabled={page === 0}
//           className="px-4 py-2 mx-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-500"
//         >
//           Previous
//         </button> */}
//         <IconButton
//           onClick={() => setPage(Math.max(0, page - 1))}
//           disabled={page === 0}
//           color="error"
//         >
//           <ArrowLeftIcon />
//         </IconButton>
//         {paginationButtons.map((button, index) => (
//           <React.Fragment key={index}>
//             {button === '...' ? (
//               <span className="mx-2">...</span>
//             ) : (
//               <button
//                 onClick={() => setPage(button)}
//                 className={`px-3 py-1 mx-1 rounded-full ${page === button ? 'bg-gray-100 text-red-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//                 disabled={page === button}
//               >
//                 {button + 1}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//         <IconButton
//           onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
//           disabled={page >= totalPages - 1}
//           color="error"
//         >
//           <ArrowRightIcon />
//         </IconButton>
//         {/* <button
//           onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
//           disabled={page >= totalPages - 1}
//           className="px-4 py-2 mx-1 bg-gray-500 text-black rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:text-gray-500"
//         >
//           Next
//         </button> */}
//       </div>
//     </TableContainer>
//   );
// };

// export default MaterialTable;