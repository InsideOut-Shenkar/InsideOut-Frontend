import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| GET REPORT BY ID HOOK ||============================== //

const useGetReports = () => {
  const getReports = async () => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/reports`, {
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

      const updatedJson = data.map((row) => ({
        id: row['id'],
        patientID: row['id_number'],
        createdBy: row['full_name'],
        medicalDataID: row['medical_data_id'],
        riskLevel: row['risk_level_label'],
        assessmentScore: data['assessment_score'],
        weight1: row['ds2_vote'],
        weight2: row['ds4_vote'],
        createdAt: row['created_at'],
        modifiedAt: row['modified_at']
      }));

      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch reports data:', err);
      throw new Error(`Reports fetching failed, details: ${err.message}`);
    }
  };

  return { getReports };
};

export default useGetReports;
