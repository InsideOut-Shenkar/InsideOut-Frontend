import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| DELETE REPORTS HOOK ||============================== //

const useDeleteReports = () => {
  const deleteReports = async (ids) => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/reports`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ids)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.details ? `${responseData.error}, details: ${responseData.details}` : responseData.error || 'Unknown error occurred'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Error occurred during deletion, details: ${error.message}`);
    }
  };

  return { deleteReports };
};

export default useDeleteReports;
