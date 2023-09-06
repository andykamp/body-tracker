import * as t from "@/foodtable-scraper/types"
import { Product } from "@/common-scraper/types"
import { UNITS, PRODUCT_SOURCES } from "@/common-scraper/constants"

// @todo: disse innneholder ikke alle reffene
const headers: string[] = [
  "MatvareID", "Matvare", "Spiselig_del", "Ref", "Vann", "Ref", "Kilojoule",
  "Ref", "Kilokalorier", "Ref", "Fett", "Ref", "Mettet", "Ref", "C12_0",
  "Ref", "C14_0", "Ref", "C16_0", "Ref", "C18_0", "Ref", "Trans", "Ref",
  "Enumettet", "Ref", "C16_1_sum", "Ref", "C18_1_sum", "Ref", "Flerumettet",
  "Ref", "C18_2n_6", "Ref", "C18_3n_3", "Ref", "C20_3n_3", "Ref", "C20_3n_6",
  "Ref", "C20_4n_3", "Ref", "C20_4n_6", "Ref", "C20_5n_3_EPA", "Ref",
  "C22_5n_3_DPA", "Ref", "C22_6n_3_DHA", "Ref", "Omega_3", "Ref", "Omega_6",
  "Ref", "Kolesterol", "Ref", "Karbohydrat", "Ref", "Stivelse", "Ref",
  "Mono_disakk", "Ref", "Sukker_tilsatt", "Ref", "Kostfiber", "Ref", "Protein",
  "Ref", "Salt", "Ref", "Alkohol", "Ref", "Vitamin_A", "Ref", "Retinol",
  "Ref", "Beta_karoten", "Ref", "Vitamin_D", "Ref", "Vitamin_E", "Ref",
  "Tiamin", "Ref", "Riboflavin", "Ref", "Niacin", "Ref", "Vitamin_B6",
  "Ref", "Folat", "Ref", "Vitamin_B12", "Ref", "Vitamin_C", "Ref", "Kalsium",
  "Ref", "Jern", "Ref", "Natrium", "Ref", "Kalium", "Ref", "Magnesium",
  "Ref", "Sink", "Ref", "Selen", "Ref", "Kopper", "Ref", "Fosfor", "Ref", "Jod", "Ref"
];

export function indexToHeader(index: number) {
  if (index < 0 || index >= headers.length) {
    throw new Error(`Index ${index} out of bounds`);
  }

  return headers[index];
}

const convertKeys = (inputObj: { [key: number]: any }): t.FoodTableInputRow => {
  const outputObj: Partial<t.FoodTableInputRow> = {};

  for (const key in inputObj) {
    const intKey = parseInt(key);
    if (intKey >= headers.length) continue;
    const newKey = indexToHeader(intKey);
    outputObj[newKey] = inputObj[key];
  }

  return outputObj as t.FoodTableInputRow;
}

export function mapCsvRowToProduct(r: t.FoodTableInputRow): Product {
  const row = convertKeys(r)

  // check if this is a valid row
  if (!row.Kilojoule) {
    console.log('excluding: ', row.Matvare);
    return null
  }


  // @todo: need to make sure the values has no nubmers etc in them. use the util
  const nutrition = {
    energy: row.Kilojoule,
    calories: row.Kilokalorier,
    fat: row.Fett,
    ofWhichSaturatedFattyAcids: row.Mettet,
    ofWhichMonounsaturatedFattyAcids: row.Enumettet,
    ofWhichPolyunsaturatedFattyAcids: row.Flerumettet,
    carbohydrates: row.Karbohydrat,
    protein: row.Protein,
    salt: row.Salt,
  }

  const info = {
    size: '100 gram',
    grams: 100,
  }

  const source = {
    type: PRODUCT_SOURCES.matvaretabellen,
    uid: PRODUCT_SOURCES.matvaretabellen,
  }

  const product: Product = {
    uid: row.MatvareID,
    title: row.Matvare,
    source,
    info,
    nutrition,
    unit: UNITS.grams,
    thumbnail: '',
  }

  return product
}
