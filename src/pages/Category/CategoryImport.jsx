import React, { useState, useEffect } from 'react';
import Layout from "../../components/layouts/Layout";
import { useDispatch, useSelector } from 'react-redux';
import { validateCategoriesImport } from "../../features/category/categorySlice";

const CategoryImport = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [validationResults, setValidationResults] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [importResults, setImportResults] = useState([]); // State to store import results
  const [successfulImports, setSuccessfulImports] = useState(0);
  const [failedImports, setFailedImports] = useState(0);
  const status = useSelector(state => state.product.status);
  const error = useSelector(state => state.product.error);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setValidationResults([]);
    setIsValid(false);
    setImportResults([]);
  };

  const handleValidate = () => {
    if (file) {
      dispatch(validateCategoriesImport({ file, shouldImport: false })).then((action) => {
        if (action.payload) {
          setValidationResults(action.payload.validationResults);
          const isAllValid = action.payload.validationResults.every(result => result.isValid);
          setIsValid(isAllValid);
        }
      });
    }
  };

  const handleImport = () => {
    if (isValid) {
      dispatch(validateCategoriesImport({ file, shouldImport: true })).then((action) => {
        if (action.payload) {
          setImportResults(action.payload.importSummary);
        } else {
          alert('Error during import.');
        }
      });
    }
  };

  useEffect(() => {
    const successful = importResults.filter(result => result.isValid).length;
    const failed = importResults.length - successful;
    setSuccessfulImports(successful);
    setFailedImports(failed);
  }, [importResults]);

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h2 className="heading">Import Categories</h2>
        
        
        <input
          className='form-control'
          style={{ width: "300px" }}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
        <button className="btn btn-primary mt-2" onClick={handleValidate} disabled={status === 'loading'}>
          {status === 'loading' ? 'Validating...' : 'Validate'}
        </button>
        {isValid && (
          <button className="btn btn-success mt-2 ml-2 ms-2" onClick={handleImport}>
            Import
          </button>
        )}

        {importResults.length > 0 && (
          <div className="mt-4">
            <h3>Import Summary</h3>
            <p className='alert alert-primary fw-bolder fs-4' style={{maxWidth:"400px"}}>{successfulImports} categories imported successfully.</p>
            <p className='alert alert-danger fw-bolder fs-4' style={{maxWidth:"400px"}}>{failedImports} categories failed to import.</p>
            <ul className="list-group" style={{fontSize: "12px"}}>
              {importResults.map((result, index) => (
                <li
                  key={index} style={{padding:"4px 6px"}}
                  className={`list-group-item ${result.isValid ? 'list-group-item-success' : 'list-group-item-danger'}`}
                >
                  {result.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationResults.length > 0 && importResults.length === 0 && (
          <div className="mt-4">
            <h3>Validation Summary</h3>
            <ul className="list-group">
              {validationResults.map((result, index) => (
                <li
                  key={index}
                  className={`list-group-item ${result.isValid ? 'list-group-item-success' : 'list-group-item-danger'}`}
                >
                  {result.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </Layout>
  );
};

export default CategoryImport;
