export const fetchEmployees = async () => {
    try {
      const res = await fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/vw_Employee_Allocation_Summary');
      const data = await res.json();
      return { status: 200, data };
    } catch (err) {
      console.error('API Error:', err);
      return { status: 500, data: [] };
    }
  };
  