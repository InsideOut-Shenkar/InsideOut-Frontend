import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| ADD MEDICAL FEATURE HOOK ||============================== //

const useUpdateMedicalFeature = () => {
  const updateMedicalFeature = async (medicalDataID, changedFeatures) => {
    try {
      const token = await getCurrentUserToken();

      const body = {
        medical_info: changedFeatures
      };
      console.log(body);

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical-data/features/${medicalDataID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }
      return data;
    } catch (err) {
      console.error('Failed to add medical features:', err);
      throw new Error(`Failed to add medical features, details: ${err.message}`);
    }
  };

  return { updateMedicalFeature };
};

export default useUpdateMedicalFeature;
