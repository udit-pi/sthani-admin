import React, { useState } from 'react';
import Layout from "../../components/layouts/Layout";
import { useDispatch, useSelector } from 'react-redux';
import { validateBrandsImport } from "../../features/brand/brandSlice";

const BrandImport = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [validationResults, setValidationResults] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const status = useSelector(state => state.brand.status);
  const error = useSelector(state => state.brand.error);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setValidationResults([]);
    setIsValid(false);
    setImportResults(null);
  };

  const handleValidate = () => {
    if (file) {
      dispatch(validateBrandsImport({ file, shouldImport: false })).then((action) => {
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
      dispatch(validateBrandsImport({ file, shouldImport: true })).then((action) => {
        if (action.payload) {
          setImportResults(action.payload.importSummary);
        } else {
          alert('Error during import.');
        }
      });
    }
  };

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h2 className="heading">Import Brands</h2>
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
          <button className="btn btn-success mt-2 ml-2" onClick={handleImport}>
            Import
          </button>
        )}

        {validationResults.length > 0 && (
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

        {importResults && (
          <div className="mt-4">
            <h3>Import Summary</h3>
            <ul className="list-group">
              {importResults.map((result, index) => (
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

export default BrandImport;
