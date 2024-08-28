import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| ADD MEDICAL DATA HOOK ||============================== //

const useAddMedicalData = () => {
  const addMedicalData = async (medicalData, idNumber) => {
    try {
      const token = await getCurrentUserToken();

      const body = {
        patient_id: idNumber,
        medical_info: medicalData
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details ? `${data.error}, details: ${data.details}.` : data.error || 'Unknown error occurred');
      }
      return data;
    } catch (err) {
      console.error('Failed to add medical data:', err);
      throw new Error(`Failed to add medical data, details: ${err.message}`);
    }
  };

  return { addMedicalData };
};

export default useAddMedicalData;
