import getCurrentUserToken from 'utils/aws/cognito/getCurrentUserToken';

// ==============================|| GET USER BY ID HOOK ||============================== //

const useGetUser = () => {
  const getUser = async (id) => {
    try {
      const token = await getCurrentUserToken();

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users/${id}`, {
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
        role: data['role'],
        fullName: data['full_name'],
        username: data['username']
      };

      return updatedJson;
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      throw new Error(`User fetching failed, details: ${err.message}`);
    }
  };

  return { getUser };
};

export default useGetUser;
