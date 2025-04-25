import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
 
const MaterialTable = ({ users }) => {
 
    const navigate = useNavigate();
 
    const handleNameClick = (employeeId) => {
        navigate(`/edit/${employeeId}`);
    };
 
    const formatDate = (dateString) => {
        if (dateString == "NULL") return 'NULL';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };
 
    return (
        <TableContainer component={Paper} className="shadow-md">
            <Table>
                <TableHead className="bg-gray-200">
                    <TableRow>
                        <TableCell align="center" >Employee ID</TableCell>
                        <TableCell align="center" >Full Name</TableCell>
                        <TableCell align="center" >Hire Date</TableCell>
                        <TableCell align="center" >Status</TableCell>
                        <TableCell align="center" >Location</TableCell>
                        <TableCell align="center" >Participation Type</TableCell>
                        <TableCell align="center" >Group Code</TableCell>
                        <TableCell align="center" >Client</TableCell>
                        <TableCell align="center" >Start Date</TableCell>
                        <TableCell align="center" >End Date</TableCell>
                        <TableCell align="center" >Total Allocation (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell align="center" >{user.EmployeeID ? user.EmployeeID : "NULL"} </TableCell>
                            <TableCell align="center"><Link
                                to={`/edit/${user.EmployeeID}`}
                                className="text-black hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                                {user.FIRST_NAME} {user.LAST_NAME}
                            </Link></TableCell>
                            <TableCell align="center" >{formatDate(user.HIRE_DATE)}</TableCell>
                            <TableCell align="center" >{user.Employee_Status ? user.Employee_Status : "INACTIVE"}</TableCell>
                            <TableCell align="center" >{user.LOCATION_CONCAT ? user.LOCATION_CONCAT : "NULL"}</TableCell>
                            <TableCell align="center" ><Link
                                to={`/assignments/${user.EmployeeID}`}
                                className="text-black hover:text-blue-800 font-medium transition-colors duration-200"
                            >{user.PARTICIPATION_TYPE ? user.PARTICIPATION_TYPE : "NOT ASSIGNED"}</Link></TableCell>
                            <TableCell align="center" >{user.C_GROUP_CODE ? user.C_GROUP_CODE : "NULL"}</TableCell>
                            <TableCell align="center" >{user.C_ASSIGNED_CLIENT ? user.C_ASSIGNED_CLIENT : "NULL"}</TableCell>
                            <TableCell align="center" >{formatDate(user.C_SOW_Start ? user.C_SOW_Start : "NULL")}</TableCell>
                            <TableCell align="center" >{formatDate(user.C_SOW_End ? user.C_SOW_End : "NULL")}</TableCell>
                            <TableCell align="center" >{user.Total_Allocation ? user.Total_Allocation : "0"}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
 
export default MaterialTable;