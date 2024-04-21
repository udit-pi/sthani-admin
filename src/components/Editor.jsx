import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';



const QuillEditor = ({ field, form, ...props }) => {

  // if (!field || typeof field.value === 'undefined') {
  //   console.error('Field or field.value is undefined:', field);
  //   return null; // Or render an error message
  // }
  const handleChange = (content) => {
    form.setFieldValue(field.name, content);
  };

  return (
    <ReactQuill
      value={field.value || ''}
      onChange={handleChange}
      {...props}
      matchVisual={false}
    />
  );
};

export default QuillEditor;
