import { OdaNutritionInfo, OdaProductInfo } from '@/oda-scraper/oda.types';

function removeNullishFields(data: Record<string, any>): Record<string, any> {
  for (const key in data) {
    if (data[key] === null || data[key] === undefined) {
      delete data[key];
    } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
      data[key] = removeNullishFields(data[key]);
    }
  }
  return data;
}

function parseSize(str: string) {
  if(!str) console.log('parseSize_failed', str)
  if (!str) return 0;
  // @todo: handle liters etc
  return parseGramToInt(str);
}

// FIX
function parseGramToInt(str: string) {
  if(!str) console.log('parseGramToInt_failed', str)
  if (!str) return 0;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function extractCalories(str: string) {
  if(!str) console.log('extractCalories_failed', str)
  if (!str) return 0;
  const match = str.match(/(\d+)\s*kcal/);
  return parseInt(match[1], 10)
}

export function mapInfoToEnglish(info: OdaProductInfo) {
  return removeNullishFields({
    size: info['Størrelse'],
    grams: parseSize(info['Størrelse']),
    deliveryDays: info['Utleveringsdager'],
    ingredients: info['Ingredienser'],
    originCountry: info['Opprinnelsesland'],
    supplier: info['Leverandør'],
    characteristics: info['Egenskaper'],
    variableWeight: info['Variabel vekt'],
    shelfLifeGuarantee: info['Holdbarhetsgaranti'],
  });
}

export function mapNutritionToEnglish(nutrition: OdaNutritionInfo) {
  return removeNullishFields({
    energy: nutrition['Energi'],
    calories: extractCalories(nutrition['Energi']),
    fat: parseGramToInt(nutrition['Fett']),
    ofWhichSaturatedFattyAcids: parseGramToInt(nutrition['hvorav mettede fettsyrer']),
    ofWhichMonounsaturatedFattyAcids: parseGramToInt(nutrition['hvorav enumettede fettsyrer']),
    ofWhichPolyunsaturatedFattyAcids: parseGramToInt(nutrition['hvorav flerumettede fettsyrer']),
    carbohydrates: parseGramToInt(nutrition['Karbohydrater']),
    protein: parseGramToInt(nutrition['Protein']),
    salt: parseGramToInt(nutrition['Salt']),
  });
}

