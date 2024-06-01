// ==============================|| ADD USER HOOK ||============================== //

const useAddUser = () => {
  const addUser = async (username, fullName, role) => {
    try {
      const body = {
        username: username,
        full_name: fullName,
        role: role
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details ? `${data.error}, details: ${data.details}.` : data.error || 'Unknown error occurred');
      }
      return data;
    } catch (err) {
      console.error('Failed to add user:', err);
      throw new Error(`Failed to add user, details: ${err.message}`);
    }
  };

  return addUser;
};

export default useAddUser;
