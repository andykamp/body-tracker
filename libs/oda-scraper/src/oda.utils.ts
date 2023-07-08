import { OdaNutritionInfo, OdaProductInfo } from './oda.types';

function parseSize(string: string) {
  // @todo: handle liters etc
  return parseGramToInt(string);
}

function parseGramToInt(string: string) {
  const match = string.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function extractCalories(string: string) {
  const match = string.match(/(\d+)\s*kcal/);
  return parseInt(match[1], 10)
}

export function mapInfoToEnglish(info: OdaProductInfo) {
  return {
    size: info['Størrelse'],
    grams: parseSize(info['Størrelse']),
    deliveryDays: info['Utleveringsdager'],
    ingredients: info['Ingredienser'],
    originCountry: info['Opprinnelsesland'],
    supplier: info['Leverandør'],
    characteristics: info['Egenskaper'],
    variableWeight: info['Variabel vekt'],
    shelfLifeGuarantee: info['Holdbarhetsgaranti'],
  };
}

export function mapNutritionToEnglish(nutrition: OdaNutritionInfo) {
  return {
    energy: nutrition['Energi'],
    calories: extractCalories(nutrition['Energi']),
    fat: parseGramToInt(nutrition['Fett']),
    ofWhichSaturatedFattyAcids: parseGramToInt(nutrition['hvorav mettede fettsyrer']),
    ofWhichMonounsaturatedFattyAcids: parseGramToInt(nutrition['hvorav enumettede fettsyrer']),
    ofWhichPolyunsaturatedFattyAcids: parseGramToInt(nutrition['hvorav flerumettede fettsyrer']),
    carbohydrates: parseGramToInt(nutrition['Karbohydrater']),
    protein: parseGramToInt(nutrition['Protein']),
    salt: parseGramToInt(nutrition['Salt']),
  };
}

