import React, { useState } from 'react';
import { useField } from 'formik';

const MultipleKeywordInput = ({ label, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const [field, meta, helpers] = useField(props);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      helpers.setValue([...field.value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handlePillRemove = (index) => {
    const newKeywords = [...field.value];
    newKeywords.splice(index, 1);
    helpers.setValue(newKeywords);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        {...props}
      />
      <div>
        {field.value.map((keyword, index) => (
          <span key={index} className="keyword-pill">
            {keyword}
            <button type="button" onClick={() => handlePillRemove(index)}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MultipleKeywordInput;
