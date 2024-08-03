import React from 'react';
import { useField } from 'formik';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';

const MultiSelectTreeDropdown = ({ options, ...props }) => {
  const [field, , helpers] = useField(props.name);

  const handleChange = (currentNode, selectedNodes) => {
    // Set the whole objects as Formik's value
    helpers.setValue(selectedNodes || []);
  };

  return (
    <DropdownTreeSelect
      data={options}
      onChange={handleChange}
      className="mdl-demo"
      {...props}
    />
  );
};

export default MultiSelectTreeDropdown;
