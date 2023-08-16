import { Product } from "@/oda-scraper/types";
import fs from 'fs';
import { writeLargeJsonToFile } from '@/oda-scraper/utils/utils.fs';
import type * as t from "@/diet-server/diet.types"
import { ITEM_TYPES } from "@/diet-server/diet.constants";

const FILE_PATH = '/Users/anderskampenes/side-projects/body-tracker/oda_products.json'

export function formatStockItem(json: Record<string, any>) {

  const itemType = ITEM_TYPES.PRODUCT;

  const stockItems: Record<string, t.StockItem> = {}

  Object.entries(json).forEach(([id, item]) => {

    const grams = item.info.grams || 0
    const numHundredGrams = grams / 100

    stockItems[id] = {
      type: itemType,
      id,
      name: item.title,

      protein: item.nutrition.protein * numHundredGrams || 0,
      calories: item.nutrition.calories * numHundredGrams || 0,
      grams,

      thumbnail: item.thumbnail,
      isStockItem: true,
    };
  });

  return stockItems;
}

export function normalizeJson(json: Record<string, any>) {
  const normalized: t.StockStateNormalized<t.StockItem> = {
    allIds: [],
    byIds: {},
  };
  Object.entries(json).forEach(([id, item]) => {
    normalized.allIds.push(id);
    normalized.byIds[id] = item;
  });
  return normalized;
}

// Read and parse JSON file
const data: { [key: string]: Product } = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));


const formatted = formatStockItem(data);
const normalized = normalizeJson(formatted);
console.log('nr', normalized);

writeLargeJsonToFile('oda_products_normalized.json', normalized);
