import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| GET PATIENTS BY ID NUMBER HOOK ||============================== //

const useGetPatientByIDNumber = () => {
  const getPatientByIDNumber = async (id) => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients/id-number/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }

      console.log('useGetPatient, data:', data);

      const updatedJson = {
        idNumber: data['id_number'],
        dob: data['date_of_birth'],
        addedBy: data['created_by'],
        id: data['id']
      };

      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch patient data:', err);
      throw new Error(`Data fetching failed, details: ${err.message}`);
    }
  };

  return { getPatientByIDNumber };
};

export default useGetPatientByIDNumber;
