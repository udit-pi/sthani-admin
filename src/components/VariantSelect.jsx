import React from 'react';
import Select from 'react-select';
import { Field } from 'formik';

const SelectOrTextInput = ({ options, field, form, ...props }) => {
  const handleChange = (selectedOption) => {
    form.setFieldValue(field.name, selectedOption);
  };

  return (
    <div>
      <Select
        options={options}
        onChange={handleChange}
        value={field.value}
        isClearable
        {...props}
      />
      <Field
        name={field.name}
        type="text"
        onChange={handleChange}
        value={field.value}
      />
    </div>
  );
};

export default SelectOrTextInput;
