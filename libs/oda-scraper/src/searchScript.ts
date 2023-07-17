import { Product } from "@/oda-scraper/types";
import fs from 'fs';

const FILE_PATH = '/Users/anderskampenes/side-projects/body-tracker/oda_products.json'

// Check if search term was passed
if (process.argv.length < 3) {
  console.log('Please provide a search term as an argument');
  process.exit(1);
}

// Read search term from command line arguments
const searchTerm = process.argv[2].toLowerCase();

// Read and parse JSON file
const data: { [key: string]: Product } = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// Search object values for searchTerm in the title
const result = Object.values(data).filter((obj: Product) => obj?.title.toLowerCase().includes(searchTerm));

// map search to return only relecant data
const formattedResult = result.map((obj: Product) => ({
  name: obj.title,
  protein: obj.nutrition.protein,
  calories: obj.nutrition.calories,
  grams: obj.info.grams
}))


// Print the result
console.log(formattedResult);

