const CustomFileInput = ({ field, form, ...props }) => {
    const handleChange = (event) => {
      const file = event.currentTarget.files[0];
      form.setFieldValue(field.name, file);
    };
  
    return (
      <input
        type="file"
        onChange={handleChange}
        {...props}
      />
    );
  };
  
export default CustomFileInput  