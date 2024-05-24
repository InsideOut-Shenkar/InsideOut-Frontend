import { parse, format } from 'date-fns';

// ==============================|| ADD PATIENT HOOK ||============================== //

const useAddPatient = () => {
  const addPatient = async (idNumber, birthDate, createdBy) => {
    try {
      // Parse the birthDate from "MM/dd/yyyy" format and format it to "yyyy-MM-dd" format
      const parsedDate = parse(birthDate, 'MM/dd/yyyy', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');

      const body = {
        id_number: idNumber,
        date_of_birth: formattedDate,
        created_by: createdBy
      };

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients`, {
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
      console.error('Failed to add patient:', err);
      throw new Error(`Failed to add patient, details: ${err.message}`);
    }
  };

  return { addPatient };
};

export default useAddPatient;
