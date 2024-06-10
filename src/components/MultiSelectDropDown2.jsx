import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

const MultiSelectDropdown = ({ options, ...props }) => {
  const [field, , helpers] = useField(props.name);

  const handleChange = (selectedOptions) => {
    // Set the whole objects as Formik's value
    helpers.setValue(selectedOptions || []);
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
      value={field.value} // Directly use Formik's value which is in the correct format
      {...props}
    />
  );
};

export default MultiSelectDropdown;
