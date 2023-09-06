// pages/api/getStockItem.js
import { NextResponse } from 'next/server';
import { ODA_STOCK_PRODUCTS } from "@/diet-server/stock/oda_products_normalized";
import { FOOD_TABLE_STOCK_PRODUCTS } from "@/diet-server/stock/foodtable_products_normalized";
import * as t from '@/diet-server/diet.types'

const odaData: t.StockStateNormalized<t.Product> = ODA_STOCK_PRODUCTS as t.StockStateNormalized<t.Product>
const foodtableData: t.StockStateNormalized<t.Product> = FOOD_TABLE_STOCK_PRODUCTS as unknown as t.StockStateNormalized<t.Product>

function getItem(id: string) {
  // Your search code here...
  if(odaData.byIds[id]) return odaData.byIds[id]
  else return foodtableData.byIds[id]
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

