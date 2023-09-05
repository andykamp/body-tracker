import { Product } from "@/common-scraper/types";
import fs from 'fs';
import readline from 'readline';

// @note: this cannot be run interativly from nx... so we have to spesifically use the ts-node and the path in package.json

const INPUT_FILE = 'oda_products.json'
const FILE_PATH = `/Users/anderskampenes/side-projects/body-tracker/${INPUT_FILE}`

// Read and parse JSON file
const data: { [key: string]: Product } = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = () => {
  rl.question('Please provide a search term, or type "exit" to quit: ', (searchTerm) => {
    if (searchTerm.toLowerCase() === 'exit') {
      rl.close();
    } else {
      // Search object values for searchTerm in the title
      const result = Object.values(data).filter((obj: Product) => obj?.title.toLowerCase().includes(searchTerm.toLowerCase()));

      // Map search to return only relevant data
      const formattedResult = result.map((obj: Product) => ({
        name: obj.title,
        protein: obj.nutrition.protein,
        calories: obj.nutrition.calories,
        grams: obj.info.grams,
        thumbnail: obj.thumbnail
      }))

      // Print the result
      console.log(formattedResult);

      // Ask the next question
      askQuestion();
    }
  });
}
// Start the script by asking the first question
askQuestion();

