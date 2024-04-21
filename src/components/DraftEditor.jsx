import React, { useState } from 'react';
import { Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useField } from 'formik';

const DraftEditor = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(value || ''))
  );

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
    // const htmlContent = stateToHTML(newEditorState.getCurrentContent());

    
    try {
        const htmlContent = stateToHTML(newEditorState.getCurrentContent());
        helpers.setValue(htmlContent);
        
      
      } catch (error) {
        console.error('Error sanitizing content:', error);
        helpers.setValue('');
      }
    // // Remove unwanted <p> tags
    // const sanitizedHtml = htmlContent.replace(/<\/?p>/g, '');

    // helpers.setValue(sanitizedHtml);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DraftEditor;
