import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';
import DOMPurify from 'dompurify';


const QuillEditor = ({ field, form, ...props }) => {

  // if (!field || typeof field.value === 'undefined') {
  //   console.error('Field or field.value is undefined:', field);
  //   return null; // Or render an error message
  // }
  const handleChange = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const cleanHTML = doc.body.innerHTML.replace(/<p><p>/g, '<p>').replace(/<\/p><\/p>/g, '</p>');
   
    const cleanContent = DOMPurify.sanitize(cleanHTML);
    form.setFieldValue(field.name, cleanContent);
  };

  return (
    <ReactQuill
      value={field.value || ''}
      onChange={handleChange}
      {...props}
      matchVisual={false}
      style={{ height: '200px', minHeight: '200px' }}

    />
  );
};

export default QuillEditor;
