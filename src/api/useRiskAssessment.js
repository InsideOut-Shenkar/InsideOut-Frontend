import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| RISK ASSESSMENT HOOK ||============================== //

const useRiskAssessment = () => {
  const riskAssessment = async (userID, patientID, medDataID, weights) => {
    try {
      const token = await getCurrentUserToken();

      const body = {
        patient_id: patientID,
        user_id: userID,
        med_data_id: medDataID,
        weights: weights
      };
      console.log(body);

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/assessment`, {
        method: 'POST',
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
      console.error('Failed to make the assessment:', err);
      throw new Error(`Risk assessment failed, details: ${err.message}`);
    }
  };

  return { riskAssessment };
};

export default useRiskAssessment;
