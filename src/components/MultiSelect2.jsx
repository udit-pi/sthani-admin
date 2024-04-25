import React from 'react';
import Select from 'react-select';

const MultiSelect2 = ({ field, form, options, ...props }) => {
    const { name, value } = field;

  console.log("Field Value:", value);
  console.log("Options:", options);

  const handleChange = (selectedOptions) => {
    form.setFieldValue(name, selectedOptions);
  };

  const handleBlur = () => {
    form.setFieldTouched(name, true);
  };

  // Convert array of category IDs to an array of option objects
  const selectedOptionObjects = value ? options.filter(option => value.includes(option.value)) : [];

  console.log("Selected Option Objects:", selectedOptionObjects);

  return (
    <Select
      {...field}
      {...props}
      options={options}
      // isMulti
      isSearchable={true}
      value={selectedOptionObjects}  // Set value as array of option objects
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default MultiSelect2;
