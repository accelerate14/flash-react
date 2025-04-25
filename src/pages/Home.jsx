// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import CardComponent from '../components/Card';
import { useEffect } from 'react';

const Home = () => {


   const navigate=useNavigate();
  
    useEffect(() => {    
        // localStorage.getItem('authToken');
        const token =localStorage.getItem('authToken') ;
        if (!token) {
          navigate('/auth/login'); // Adjust path as needed
        }
      }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <h2 className='text-2xl'>Navigate through the pages to continue exploring.</h2>
          {/* <CardComponent title="Employees" content="Manage employees here." />
          <CardComponent title="Departments" content="View or edit departments." /> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
