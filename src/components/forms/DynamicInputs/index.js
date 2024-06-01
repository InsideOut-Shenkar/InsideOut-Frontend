import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import MedicalFields from 'assets/MedicalFields';
import NumericField from 'components/NumericField';
import FieldSelector from 'components/FieldSelector';

// ==============================|| DYNAMIC INPUTS ||============================== //

const DynamicInputs = ({ inputs_type, defaultValues }) => {
  const [fields, setFields] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  useEffect(() => {
    async function fetchFields() {
      try {
        const results = await MedicalFields.get(inputs_type);
        const medFields = results.filter(({ name }) => name !== 'age' && name !== 'vital status');
        setFields(medFields);
        const initialValues = medFields.reduce((acc, medField) => {
          acc[medField.name] = undefined;
          return acc;
        }, {});

        setInputValues(initialValues);
      } catch (error) {
        console.error('Failed to fetch medical fields:', error);
      }
    }
    fetchFields();
  }, [inputs_type]);

  useEffect(() => {
    if (defaultValues) {
      const updatedInputValues = { ...inputValues };
      const fieldsName = fields.map(({ name }) => name);
      Object.keys(defaultValues).forEach((key) => {
        if (key in fieldsName) {
          updatedInputValues[key] = defaultValues[key];
        }
      });
      console.log('updatedInputValues', updatedInputValues);
      setInputValues(updatedInputValues);
    }
  }, [fields, defaultValues, inputValues]);

  return (
    <>
      {fields
        .filter((field) => field.type === 'category')
        .map((field, index) => (
          <Grid item xs={12} sm={6} key={field.id || index}>
            <FieldSelector
              field={field}
              handleChange={handleChange}
              defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : undefined}
              index={index}
            />
          </Grid>
        ))}
      {fields
        .filter((field) => field.type === 'int' || field.type === 'float')
        .map((field, index) => (
          <Grid item xs={12} sm={6} key={field.id || index}>
            <NumericField
              field={field}
              handleChange={handleChange}
              defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : undefined}
              index={index}
            />
          </Grid>
        ))}
    </>
  );
};

export default DynamicInputs;
