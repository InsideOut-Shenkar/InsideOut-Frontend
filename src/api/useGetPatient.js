// ==============================|| GET PATIENTS HOOK ||============================== //

const useGetPatient = () => {
  const getPatient = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }

      const updatedJson = data.map((row, index) => ({
        id: index,
        idNumber: row['id_number'],
        age: row['date_of_birth'],
        assessmentNo: row['report_count'],
        addedBy: row['full_name']
      }));
      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch patient data:', err);
      throw new Error(`Data fetching failed, details: ${err.message}`);
    }
  };

  return { getPatient };
};

export default useGetPatient;
