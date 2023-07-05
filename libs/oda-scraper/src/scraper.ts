import {getContents} from '@/oda-scraper/oda.api';


(async function main() {
  console.log('---scraping---',);
  const categories = await getContents()
  console.log('---scraping done---',);
}())
