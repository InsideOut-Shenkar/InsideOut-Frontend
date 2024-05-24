// ==============================|| DELETE PATIENTS HOOK ||============================== //

const useDeletePatients = () => {
  const deletePatients = async (ids) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
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

  return { deletePatients };
};

export default useDeletePatients;
