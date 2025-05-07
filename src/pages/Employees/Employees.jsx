// pages/Employee.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "../../components/MaterialTable";
import { useNavigate } from "react-router-dom";
import logo from "./icons8-excel-48.png";
import pluslogo from "./icons8-plus-math-80.png";
import AddUser from "./AddUser";
// import './assignments.css';


const Employee = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    hireDateFrom: "",
    hireDateTo: "",
    status: "",
    allocation: "",
    location: "",
    participationType: "",
    groupCode: "",
    client: "",
  });

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      hireDateFrom: "",
      hireDateTo: "",
      status: "",
      allocation: "",
      location: "",
      participationType: "",
      groupCode: "",
      client: "",
    });
  };

  useEffect(() => {
    // localStorage.getItem('authToken');
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/login"); // Adjust path as needed
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get(
        "https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/vw_Employee_Allocation_Summary"
      )
      .then((res) => {
        if (res.data.status === 200) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  const filterData = (data) => {
    const today = new Date();

    return data.filter((user) => {
      const fullName = `${user.FIRST_NAME ?? ""} ${
        user.LAST_NAME ?? ""
      }`.toLowerCase();
      const hireDate = new Date(user.HIRE_DATE);
      const sowEndDate = user.C_SOW_End ? new Date(user.C_SOW_End) : null;
      const from = filters.hireDateFrom ? new Date(filters.hireDateFrom) : null;
      const to = filters.hireDateTo ? new Date(filters.hireDateTo) : null;

      const isNameMatch = fullName.includes(filters.name.toLowerCase());
      const isHireDateMatch =
        (!from || hireDate >= from) && (!to || hireDate <= to);
      const isStatusMatch = !filters.status || user.Status === filters.status;
      const isLocationMatch =
        !filters.location || user.LOCATION_CONCAT === filters.location;
      const isParticipationTypeMatch =
        !filters.participationType ||
        user.PARTICIPATION_TYPE === filters.participationType;
      const isGroupCodeMatch =
        !filters.groupCode || user.C_GROUP_CODE === filters.groupCode;
      const isClientMatch =
        !filters.client || user.C_ASSIGNED_CLIENT === filters.client;
      const allocation = user.Total_Allocation ?? 0;
      const isAllocationMatch =
        !filters.allocation ||
        (filters.allocation === "over" && allocation > 100) ||
        (filters.allocation === "under" && allocation < 100) ||
        (filters.allocation === "fully" && allocation === 100);

      const isSowEndInFuture = !sowEndDate || sowEndDate >= today;

      return (
        isNameMatch &&
        isHireDateMatch &&
        isStatusMatch &&
        isLocationMatch &&
        isParticipationTypeMatch &&
        isGroupCodeMatch &&
        isClientMatch &&
        isAllocationMatch &&
        isSowEndInFuture
      );
    });
  };

  // const adduserTab = () => {
  //   navigate("/adduser");
  // };

  const downloadCSV = () => {
    const headers = [
      "FIRST_NAME",
      "LAST_NAME",
      "HIRE_DATE",
      "Employee_Status",
      "LOCATION_CONCAT",
      "PARTICIPATION_TYPE",
      "C_GROUP_CODE",
      "C_ASSIGNED_CLIENT",
      "C_SOW_Start",
      "C_SOW_End",
      "Total_Allocation",
    ];

    const formatDateOrNull = (dateStr) => {
      const d = new Date(dateStr);
      if (!dateStr || isNaN(d)) return "null";
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    };

    const csvRows = [
      headers.join(","),
      ...filteredUsers.map((u) =>
        headers
          .map((h) => {
            switch (h) {
              case "HIRE_DATE":
              case "C_SOW_Start":
              case "C_SOW_End":
                return `"${formatDateOrNull(u[h])}"`;
              case "Employee_Status":
                return `"${u[h] ?? "ACTIVE"}"`; // default fallback
              case "LOCATION_CONCAT":
              case "PARTICIPATION_TYPE":
              case "C_GROUP_CODE":
              case "C_ASSIGNED_CLIENT":
                return `"${u[h] ?? "null"}"`; // use string "null" if empty
              case "Total_Allocation":
                return u[h] == null || u[h] === "" ? "0" : u[h];
              default:
                return `"${(u[h] ?? "").toString().replace(/"/g, '""')}"`;
            }
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employee_list.csv";
    link.click();
  };

  const filteredUsers = filterData(users);


  const adduser = () => {
    setIsOverlayOpen(true);
  };
  
  return (
   
  
    


    <div className="p-5">


      {/* overlay component */}
      {isOverlayOpen && (
  <div className="fixed inset-0 z-50 flex ">
    {/* Background Dimming */}
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={() => setIsOverlayOpen(false)}
    ></div>

    {/* Slide-in Panel */}
    {/* <div className="ml-auto w-full max-w-md bg-white shadow-xl z-50 h-full p-6 animate-slide-in-right overflow-y-auto"> */}
    <div className="ml-auto w-full max-w-sm bg-white z-50 h-full p-6 animate-slide-in-right overflow-y-auto">

    <div className="flex justify-end mb-4">
  <button
    onClick={() => setIsOverlayOpen(false)}
    className="text-gray-600 hover:text-black text-2xl"
  >
    X
  </button>
</div>

      <AddUser onSuccess={() => setIsOverlayOpen(false)} />
    </div>
  </div>
)}




      <div className="flex gap-6">
        {/* Filters - left side */}
        {/* <div className="fixed top-[90px] max-w-[12rem] h-[calc(100vh-50px)] flex flex-col gap-4 pt-[30px] px-[13px] mb-6  bg-[#e2f4ff] overflow-y-auto"> */}
        <div className="fixed top-[90px] max-w-[12rem] h-[calc(100vh-50px)] flex flex-col gap-4 pt-[30px] px-[13px] pb-6 bg-[#e2f4ff] overflow-y-auto rounded-2xl shadow-lg border border-gray-200">

{/* Name Input */}
<div>
  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Search by Name</label>
  <input
    id="name"
    type="text"
    className="w-full p-2 border rounded-2xl shadow-lg bg-white"
    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    value={filters.name}
    onChange={handleInputChange}
  />
</div>

{/* Hire Date From */}
<div>
  <label htmlFor="hireDateFrom" className="block mb-1 text-sm font-medium text-gray-700">Hire Date From</label>
  <input
    id="hireDateFrom"
    type="date"
    className="w-full p-2 border rounded-2xl shadow-sm bg-white"
    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    value={filters.hireDateFrom}
    onChange={handleInputChange}
  />
</div>

{/* Hire Date To */}
<div>
  <label htmlFor="hireDateTo" className="block mb-1 text-sm font-medium text-gray-700">Hire Date To</label>
  <input
    id="hireDateTo"
    type="date"
    className="w-full p-2 border rounded-2xl shadow-sm bg-white"
    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    value={filters.hireDateTo}
    onChange={handleInputChange}
  />
</div>

{/* Utility function to render selects */}
{[
  { id: "status", label: "Status", options: ["", "ACTIVE", "INACTIVE"] },
  { id: "allocation", label: "Allocation", options: ["", "over", "under", "fully"] },
  { id: "participationType", label: "Participation Type", options: [...new Set(users.map(u => u.PARTICIPATION_TYPE))] },
  { id: "location", label: "Location", options: [...new Set(users.map(u => u.LOCATION_CONCAT))] },
  { id: "groupCode", label: "Group Code", options: [...new Set(users.map(u => u.C_GROUP_CODE))] },
  { id: "client", label: "Client", options: [...new Set(users.map(u => u.C_ASSIGNED_CLIENT))] },
].map(({ id, label, options }) => (
  <div key={id}>
    <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      id={id}
      className="w-full p-2 border rounded-2xl shadow-sm bg-white text-gray-700"
      style={{
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        color: "#000",
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg fill='red' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1.25em",
      }}
      value={filters[id]}
      onChange={handleInputChange}
    >
      {id === "status" || id === "allocation"
        ? options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "" ? `All ${label}s` : opt}
            </option>
          ))
        : [<option key="">All {label}s</option>, ...options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))]}
    </select>
  </div>
))}

{/* Clear Filters Button */}
<button
  onClick={clearFilters}
  className="p-2 bg-red-500 text-black rounded-2xl shadow-sm mb-4"
  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
>
  Clear Filters
</button>
</div>


        <div>
          <div className="text-center p-2 text-[#dc0022] text-4xl font-roboto">
            Employee Snapshot
          </div>

          {/* Image and table - right side */}
          <div className="flex-1 flex flex-col pl-53 ">
            <div className="flex justify-end mb-4  ">
              <img
                onClick={downloadCSV}
                src={logo}
                alt="Logo"
                className="h-8 w-8 cursor-pointer mr-5 p-[1px] rounded border border-gray-400 shadow-md"
              />
              <img
                onClick={adduser}
                // onClick={adduserTab}
                src={pluslogo}
                alt="Logo"
                className="h-8 w-8 cursor-pointer mr-30 p-[1px] rounded border border-gray-700 shadow-xl"
              />
            </div>

            <div className="flex-1">
              <MaterialTable users={filteredUsers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
