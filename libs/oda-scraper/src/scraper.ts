import { getContents } from '@/oda-scraper/oda.api';
// import firebaseCrudApi from '@/oda-scraper/oda.firebase';
import { writeLargeJsonToFile} from '@/oda-scraper/utils/utils.fs';
// import { products } from './__support__/fixtures/product';


(async function main() {
  console.log('---scraping---',);
  const items = await getContents()
  // console.log('final items',);
  // console.dir(items, { depth: null, colors: true });

  // store items to firebase
  // console.log('storing to firestore',);
  // firebaseCrudApi.storeProducts(items)
  console.log('---scraping done---',);

  await writeLargeJsonToFile('oda_products.json', items);
  console.log('storing to file done', );

  // later...
  // const read_products = await readLargeJsonFromFile('products.json');
  // console.log('read_products', read_products);
}())
