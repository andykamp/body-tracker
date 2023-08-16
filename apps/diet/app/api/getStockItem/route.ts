// pages/api/getStockItem.js
import { NextResponse } from 'next/server';
import { ODA_STOCK_PRODUCTS } from "@/diet-server/stock/oda_products_normalized";
import * as t from '@/diet-server/diet.types'

const data: t.StockStateNormalized<t.Product> = ODA_STOCK_PRODUCTS as t.StockStateNormalized<t.Product>

function getItem(id: string) {
  // Your search code here...
  return data.byIds[id]
}

export async function GET(req: Request,) {
  // Parse the request URL
  const url = new URL(req.url, 'http://localhost'); // Base URL doesn't matter since we only need the query parameters

  // Extract the "search" query parameter
  const itemId = url.searchParams.get('id') || '';

  // Perform the search...
  const results = getItem(itemId);
  console.log('restults',results  );

  // Send the results back to the client
  return NextResponse.json(results);
}

