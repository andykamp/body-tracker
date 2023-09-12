import { readCsv } from '@/common-scraper/utils/utils.fs'
import * as t from "@/foodtable-scraper/types"
import { Product } from "@/common-scraper/types"
import { mapCsvRowToProduct } from "@/foodtable-scraper/utils/utils.format"


async function readCsvFile(path: string) {
  // @todo: remove header items?
  const csvData = readCsv(path,) as t.FoodTableInputRow[]
  return csvData.slice(1) // exclude header
}


function parseCsvRow(row: t.FoodTableInputRow): Product {
  return mapCsvRowToProduct(row)
}

function parseCsv(data: t.FoodTableInputRow[]) {
  const parsedData: Product[] = []
  for (const row of data) {
    const rowParsed = foodTableApi.parseCsvRow(row)
    // only add valid rows
    if (rowParsed) {
      parsedData.push(rowParsed)
    }
  }
  return parsedData
}

const foodTableApi = {
  readCsvFile,
  parseCsvRow,
  parseCsv,
}

export type FoodTableApi = typeof foodTableApi
export default foodTableApi

