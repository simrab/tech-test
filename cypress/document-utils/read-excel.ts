import readXlsxFile from 'read-excel-file/node';

const readExcelFile = (filename: string) => {
  // we must read the Excel file using Node library
  // and can return the parsed list to the browser
  // for the spec code to validate it
  console.log('reading Excel file %s', filename);
  console.log('from cwd %s', process.cwd());

  return readXlsxFile(filename);
};

export default readExcelFile;
