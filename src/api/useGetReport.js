import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| GET REPORT BY ID HOOK ||============================== //

const useGetReport = () => {
  const getReport = async (id) => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/reports/${id}`, {
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

      const updatedJson = {
        id: data['id'],
        patientID: data['patient_id'],
        createdBy: data['created_by'],
        medicalDataID: data['medical_data_id'],
        riskLevel: data['risk_level_label'],
        assessmentScore: data['assessment_score'],
        weight1: data['ds2_vote'],
        weight2: data['ds4_vote'],
        createdAt: data['created_at'],
        modifiedAt: data['modified_at']
      };

      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      throw new Error(`Report fetching failed, details: ${err.message}`);
    }
  };

  return { getReport };
};

export default useGetReport;
