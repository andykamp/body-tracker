import * as fs from 'fs';
import * as util from 'util';
// import csv from 'csv-parser';
import * as XLSX from 'xlsx';

// write

const writeFile = util.promisify(fs.writeFile);

export async function writeLargeJsonToFile(filePath: string, jsonData: any) {
  const data = JSON.stringify(jsonData);
  await writeFile(filePath, data);
}

// read

const readFile = util.promisify(fs.readFile);

// json
export async function readLargeJsonFromFile(filePath: string) {
  const data = await readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// csv
interface CsvRow {
  [key: string]: string;
}

// export async function readCsv(path: string, separator = ','): Promise<CsvRow[]> {
//   const results: CsvRow[] = [];

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(path)
//       .pipe(csv({ separator }))
//       .on('data', (data) => results.push(data))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', (error) => {
//         reject(error);
//       });
//   });

export const readCsv = (path: string): CsvRow[] => {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n').filter(line => line.split(';').length > 5); // Filtering out lines with too few semicolons

  return lines.map(line => { // skip header
    const cells = line.split(';');
    const obj = {} as CsvRow;
    for (let i = 0; i < cells.length; i++) {
      obj[i] = cells[i]
    }
    return obj
  })
}

// xlsx
export function readExcel(path: string): CsvRow[] {
  const workbook = XLSX.readFile(path);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert worksheet to json
  const data: CsvRow[] = XLSX.utils.sheet_to_json(worksheet);

  return data;
}

