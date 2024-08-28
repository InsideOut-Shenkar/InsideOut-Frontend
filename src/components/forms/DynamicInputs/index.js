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

  useEffect(() => {
    async function fetchFields() {
      try {
        const results = await MedicalFields.get(inputs_type);
        const medFields = results.filter(({ name }) => name !== 'age' && name !== 'vital status');
        setFields(medFields);
      } catch (error) {
        console.error('Failed to fetch medical fields:', error);
      }
    }
    fetchFields();
  }, [inputs_type]);

  return (
    <>
      {fields
        .filter((field) => field.type === 'category')
        .map((field, index) => (
          <Grid item xs={12} sm={6} key={field.id || index}>
            <FieldSelector
              field={field}
              defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : ''}
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
              defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : ''}
              index={index}
            />
          </Grid>
        ))}
    </>
  );
};

export default DynamicInputs;
