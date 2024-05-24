// ==============================|| GET PATIENTS HOOK ||============================== //

const calculateAge = (dob) => {
  const birthday = new Date(dob);
  const now = new Date();
  let ageInYears = now.getFullYear() - birthday.getFullYear();
  let ageInMonths = now.getMonth() - birthday.getMonth();

  if (ageInMonths < 0 || (ageInMonths === 0 && now.getDate() < birthday.getDate())) {
    ageInYears--;
    ageInMonths = 12 + ageInMonths;
  }

  if (ageInMonths === 0 && now.getDate() >= birthday.getDate()) {
    ageInMonths = 11;
  }

  return `${ageInYears}Y ${ageInMonths}M`;
};

const useGetPatients = () => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/view/patients`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }

      const updatedJson = data.map((row, index) => ({
        id: index,
        idNumber: row['id_number'],
        age: calculateAge(row['date_of_birth']),
        assessmentNo: row['report_count'],
        addedBy: row['full_name']
      }));
      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch patients data:', err);
      throw new Error(`Data fetching failed, details: ${err.message}`);
    }
  };

  return { fetchData };
};

export default useGetPatients;
