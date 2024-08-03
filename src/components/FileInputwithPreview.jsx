import React, { useState, useEffect } from 'react';

const FileInputWithPreview = ({
  field, // { name, value, onChange, onBlur }
  form: { setFieldValue, touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  className,
  style,
  imageBaseUrl,
  ...props
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (field.value && field.value instanceof Blob) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(field.value);
    } else if (field.value && typeof field.value === 'string' && field.value !== '') {
      setPreview(`${imageBaseUrl}${field.value}`); // Construct the full URL
    } else {
      setPreview(null); // Reset preview for new items
    }
  }, [field.value, imageBaseUrl]);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue(field.name, file);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className='d-flex'>
       {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ height: '100px', width: 'auto' }} />
        </div>
      )}
      <input
        type="file"
        onChange={handleChange}
        className={className}
        style={style}
        {...props}
        style={{flexGrow: "1", height:"40px", marginLeft:"20px"}}
      />
     
      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </div>
  );
};

export default FileInputWithPreview;
