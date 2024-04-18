import React, { useState, useEffect } from 'react';

// material-ui
import { TextField, Autocomplete } from '@mui/material';

// ==============================|| FIELD SELECTOR ||============================== //

const FieldSelector = ({ field, handleChange, idDisabling, defaultValue, index }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (defaultValue) {
      const selected = field.options.find((option) => option === defaultValue);
      if (selected) {
        setValue({ label: selected, id: field.options.indexOf(selected) });
      }
    }
  }, [defaultValue, field]);

  return (
    <Autocomplete
      disablePortal
      id={`combo-box-${field.id || index}`}
      options={field.options?.map((option, index) => ({
        label: option,
        id: index
      }))}
      fullWidth
      onChange={(event, value) => {
        const syntheticEvent = {
          target: {
            name: field.name,
            value: value?.label
          }
        };
        handleChange(syntheticEvent);
        setValue(value);
      }}
      value={value}
      renderInput={(params) => <TextField {...params} label={field.name} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={idDisabling}
    />
  );
};

export default FieldSelector;
