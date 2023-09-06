// pages/api/search.js
import { NextResponse } from 'next/server';
import { ODA_STOCK_PRODUCTS } from "@/diet-server/stock/oda_products_normalized";
import * as t from '@/diet-server/diet.types'

const data: t.StockStateNormalized<t.Product> = ODA_STOCK_PRODUCTS as t.StockStateNormalized<t.Product>

function performSearch(search: string) {
  // Return an empty array if the search string is empty
  if (search === "") return [];

  // Convert the search string to lowercase outside the loop
  const lowerSearch = search.toLowerCase();

  // Initialize the results array
  const results = [];

  // Use a for loop to filter and transform the results
  for (const id of data.allIds) {
    const item = data.byIds[id];
    const term = item.name ? item.name.toLowerCase() : "";

    // If the term is not empty and includes the search string, add the item to the results
    if (term && term.includes(lowerSearch)) {
      results.push(item);
    }
  }

  return results;
}

export async function GET(req: Request,) {
  console.log('SEARCH_REQ',  );
  // Parse the request URL
  const url = new URL(req.url, 'http://localhost'); // Base URL doesn't matter since we only need the query parameters
  console.log('SEARCH_REQ_URL',url  );

  // Extract the "search" query parameter
  const search = url.searchParams.get('search') || '';
  console.log('search',search  );

  // Perform the search...
  const results = performSearch(search);
  console.log('restults',results  );

  // Send the results back to the client
  return NextResponse.json(results);
}
