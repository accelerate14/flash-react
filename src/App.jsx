import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Employees from './pages/Employees/Employees';
import Edit_Employees from './pages/Employees/Edit_Employees';
import Assignments from './pages/Employees/Assignments';
import Index from './pages/Departments/Index';
import EditDepartment from './pages/Departments/EditDepartment';
import AddDepartment from './pages/Departments/AddDepartment';
import JobPosition from './pages/Jobs Positions/JobPosition';
import AddJobPosition from './pages/Jobs Positions/AddJobPosition';
import EditJobPosition from './pages/Jobs Positions/EditJobPosition';
import Participations from './pages/Role/Participations';
import AddParticipation from './pages/Role/AddParticipation';
import EditParticipation from './pages/Role/EditParticipation';
import AddProject from './pages/Project/AddProject';
import EditProject from './pages/Project/EditProject';
import Project from './pages/Project/Project';
import AddLocation from './pages/Locations/AddLocation';
import EditLocation from './pages/Locations/EditLocation';
import Location from './pages/Locations/Location';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Example from './components/Example';
import NavbarTest from './components/NavbarTest';
import AddUser from './pages/Employees/AddUser';
 


function AppContent({ isAuthenticated, logout }) {
  const location = useLocation();
  const hideNavbarRoutes = ['/auth/login', '/auth/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavbarTest isAuthenticated={isAuthenticated} logout={logout} />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/employees" element={<Employees />} />
        <Route path="/edit/:EmployeeID" element={<Edit_Employees />} />
        <Route path="/assignments/:employeeId" element={<Assignments />} />



        <Route path="/adduser" element={<AddUser />} />
 

        <Route path="/departments/" element={<Index />} />
        <Route path="/edit-department/" element={<EditDepartment />} />
        <Route path="/add-department/" element={<AddDepartment />} />

        <Route path="/job-positions" element={<JobPosition />} />
        <Route path="/add-jobposition" element={<AddJobPosition />} />
        <Route path="/edit-jobposition/:JobPositionID" element={<EditJobPosition />} />

        <Route path="/roles" element={<Participations />} />
        <Route path="/add-participation" element={<AddParticipation />} />
        <Route path="/edit-participation/:ParticipationID" element={<EditParticipation />} />

        <Route path="/add-project" element={<AddProject />} />
        <Route path="/edit-project" element={<EditProject />} />
        <Route path="/projects" element={<Project />} />

        <Route path="/addlocation" element={<AddLocation />} />
        <Route path="/editlocation" element={<EditLocation />} />
        <Route path="/locations" element={<Location />} />

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path='/ex' element={<Example/>}/>
      </Routes>

      {!shouldHideNavbar && <Footer />}
    </>
  );
}

function App() {
  const isAuthenticated = true; 
  const logout = () => alert('Logout clicked'); 

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} logout={logout} />
    </Router>
  );
}

export default App;
