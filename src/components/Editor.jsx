import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import he from 'he'; // Importing the he library for decoding

const QuillEditor = ({ field, form, ...props }) => {
  const handleChange = (content) => {
    const cleanContent = DOMPurify.sanitize(content);
    form.setFieldValue(field.name, cleanContent);
  };

  // Decode HTML entities when setting the initial value
  const getInitialValue = () => {
    return field.value ? he.decode(field.value) : '';
  };

  return (
    <ReactQuill
      value={getInitialValue()}
      onChange={handleChange}
      {...props}
      style={{ height: '200px', minHeight: '200px' }}
    />
  );
};

export default QuillEditor;
