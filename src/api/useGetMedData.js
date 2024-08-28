import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| GET MEDICAL DATA HOOK ||============================== //

const useGetMedData = () => {
  const getMedData = async (id) => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical-data/${id}`, {
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
      return data;
    } catch (err) {
      console.error('Failed to fetch medical data:', err);
      throw new Error(`Medical data fetching failed, details: ${err.message}`);
    }
  };

  return { getMedData };
};

export default useGetMedData;
