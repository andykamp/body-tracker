import foodtableApi from '@/foodtable-scraper/api';
import { writeLargeJsonToFile } from '@/common-scraper/utils/utils.fs';

(async function main() {
  const INPUT_FILE = 'Matvaretabellen.csv'
  const FILE_PATH = `/Users/anderskampenes/side-projects/body-tracker/body-tracker/data/${INPUT_FILE}`
  const OUTPUT_FILE = 'foodtable_products.json'
  const OUTPUT_PATH = `/Users/anderskampenes/side-projects/body-tracker/body-tracker/data/${OUTPUT_FILE}`
  console.log('---scraping---', FILE_PATH);
  const data = await foodtableApi.readCsvFile(FILE_PATH)
  const parsedData = foodtableApi.parseCsv(data)
  console.log('parserdatra',parsedData );


  console.log('storing', );
  await writeLargeJsonToFile(OUTPUT_PATH, parsedData);
  console.log('storing to file done',);
  console.log('---scraping done---',);

}())
