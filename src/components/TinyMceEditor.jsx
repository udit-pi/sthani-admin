import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ field, form, ...props }) => {
  const [content, setContent] = useState(field.value || '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.getContent()) {
      editorRef.current.setContent(content || '');
    }
  }, [content]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    form.setFieldValue(field.name, newContent);
  };

  return (
    <Editor
      {...props}
      apiKey="2660dun05ku0jhf9az7x81jozt3uxpt5tc2iuy2l6ozcp2zk"
      onEditorChange={handleEditorChange}
      onInit={(editor) => {
        editorRef.current = editor;
        editor.setContent(content);
      }}
      initialValue={content}
    />
  );
};

export default TinyMCEEditor;
