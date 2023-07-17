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
  energy?: string;
  calories?: string;
  fat?: string;
  ofWhichSaturatedFattyAcids?: string;
  ofWhichMonounsaturatedFattyAcids?: string;
  ofWhichPolyunsaturatedFattyAcids?: string;
  carbohydrates?: string;
  protein?: string;
  salt?: string;
};

export type Product= {
  uid: string;
  odaUid: string;
  odacategoryName: string;
  odaSubCategoryName: string;
  title: string;
  info: ProductInfo;
  nutrition: NutritionInfo;
  unit: string;
};

