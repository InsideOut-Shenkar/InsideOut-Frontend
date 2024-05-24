import React, { useState, useEffect } from 'react';

// material-ui
import TextField from '@mui/material/TextField';

// ==============================|| NUMERIC FIELD ||============================== //

const NumericField = ({ field, index, handleChange, idDisabling, defaultValue }) => {
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    if (defaultValue) {
      setValue(Number(defaultValue));
    }
  }, [defaultValue]);

  return (
    <TextField
      required
      fullWidth
      id={`number-${field.id || index}`}
      label={field.name}
      name={field.name}
      type="number"
      InputLabelProps={{
        shrink: true
      }}
      inputProps={{
        min: field.range[0],
        max: field.range[1],
        step: field.type === 'float' ? 'any' : '1'
      }}
      onChange={(event) => {
        handleChange(event);
        setValue(event.value);
      }}
      disabled={idDisabling}
      value={value}
    />
  );
};

export default NumericField;
