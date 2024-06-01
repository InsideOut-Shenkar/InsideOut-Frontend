// ==============================|| GET MEDICAL DATA HOOK ||============================== //

const useGetMedData = () => {
  const getMedData = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical-data/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }
      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch medical data:', err);
      throw new Error(`Data fetching failed, details: ${err.message}`);
    }
  };

  return { getMedData };
};

export default useGetMedData;
