import { Unit, ProductSources } from "./constants"

export type OdaProductInfo = {
  Størrelse: string;
  Utleveringsdager?: string;
  Ingredienser?: string;
  Opprinnelsesland?: string;
  Leverandør?: string;
  Egenskaper?: string;
  'Variabel vekt'?: string;
  Holdbarhetsgaranti?: string;
};

export type OdaNutritionInfo = {
  Energi: string;
  Fett: string;
  'hvorav mettede fettsyrer'?: string;
  'hvorav enumettede fettsyrer'?: string;
  'hvorav flerumettede fettsyrer'?: string;
  Karbohydrater: string;
  Protein: string;
  Salt?: string;
};

export type ProductInfo = {
  size?: string;
  grams?: number;
  deliveryDays?: string;
  ingredients?: string;
  originCountry?: string;
  supplier?: string;
  characteristics?: string;
  variableWeight?: string;
  shelfLifeGuarantee?: string;
};

export type NutritionInfo = {
  energy?: number;
  calories?: number;
  fat?: number;
  ofWhichSaturatedFattyAcids?: number;
  ofWhichMonounsaturatedFattyAcids?: number;
  ofWhichPolyunsaturatedFattyAcids?: number;
  carbohydrates?: number;
  protein?: number;
  salt?: number;
};


export type ProductSource = {
  type: ProductSources;
  uid: string;
  categoryName?: string;
  subCategoryName?: string;
}

export type Product = {
  uid: string;
  title: string;
  source?: ProductSource;
  info: ProductInfo;
  nutrition: NutritionInfo;
  unit: Unit;
  thumbnail: string;
};

