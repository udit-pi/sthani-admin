import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ field, form, ...props }) => {
  const handleChange = (content) => {
    form.setFieldValue(field.name, content);
  };

  return (
    <ReactQuill
      value={field.value || ''}
      onChange={handleChange}
      {...props}
    />
  );
};

export default QuillEditor;
