// utils/importFromCsv.js
import Papa from 'papaparse';

const importFromCsv = (csvFile, callback) => {
  Papa.parse(csvFile, {
    header: true,
    complete: (results) => {
      callback(results.data);
    },
  });
};

export default importFromCsv;
