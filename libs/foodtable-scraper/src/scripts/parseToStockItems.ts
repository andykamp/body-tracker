import { Product } from "@/common-scraper/types";
import fs from 'fs';
import { writeLargeJsonToFile } from '@/common-scraper/utils/utils.fs';
import type * as t from "@/diet-server/diet.types"
import { ITEM_TYPES } from "@/diet-server/diet.constants";
import { v4 as uuid } from 'uuid';


const INPUT_FILE = 'foodtable_products.json'
const INPUT_PATH = `/Users/anderskampenes/side-projects/body-tracker/body-tracker/data/${INPUT_FILE}`

const OUTPUT_FILE = 'foodtable_products_normalized.json'
const OUTPUT_PATH = `/Users/anderskampenes/side-projects/body-tracker/body-tracker/data/${OUTPUT_FILE}`

export function formatStockItem(json: Record<string, any>) {

  const itemType = ITEM_TYPES.PRODUCT;

  const stockItems: Record<string, t.StockItem> = {}

  Object.entries(json).forEach(([_index, item]) => {
    const id = uuid();

    stockItems[id] = {
      type: itemType,
      id,
      name: item.title,

      protein: item.nutrition.protein,
      calories: item.nutrition.calories,
      grams: item.info.grams,

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
const data: { [key: string]: Product } = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));


const formatted = formatStockItem(data);
const normalized = normalizeJson(formatted);
console.log('nr', normalized);

writeLargeJsonToFile(OUTPUT_PATH, normalized);
