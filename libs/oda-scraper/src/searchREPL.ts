import { Product } from "@/oda-scraper/types";
import fs from 'fs';
import readline from 'readline';

console.log('REPLKLLL', );
const FILE_PATH = '/Users/anderskampenes/side-projects/body-tracker/oda_products.json'

// Read and parse JSON file
const data: { [key: string]: Product } = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
console.log('repll data loaded', );

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = () => {
  rl.question('Please provide a search term, or type "exit" to quit: ', (searchTerm) => {
    console.log('fdsfsdfsd', );
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
        grams: obj.info.grams
      }))

      // Print the result
      console.log(formattedResult);

      // Ask the next question
      askQuestion();
    }
  });
}
console.log('asking question', );

// Start the script by asking the first question
askQuestion();
  rl.question('Please provide a search term, or type "exit" to quit: ', (searchTerm) => {
  console.log('fdsdsfsfsdfsdfsfsffsf', );
  })

