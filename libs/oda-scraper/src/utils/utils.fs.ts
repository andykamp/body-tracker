import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);

export async function writeLargeJsonToFile(filePath: string, jsonData: any) {
  const data = JSON.stringify(jsonData);
  await writeFile(filePath, data);
}


const readFile = util.promisify(fs.readFile);

export async function readLargeJsonFromFile(filePath: string) {
  const data = await readFile(filePath, 'utf8');
  return JSON.parse(data);
}
