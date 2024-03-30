import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

const MultiSelectDropdown = ({ options, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (selectedOptions) => {
    helpers.setValue(selectedOptions);
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  return (
    <Select
      options={options}
      isMulti
      onChange={handleChange}
      onBlur={handleBlur}
      value={field.value}
      {...props}
    />
  );
};

export default MultiSelectDropdown;
