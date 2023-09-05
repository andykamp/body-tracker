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


export type ProductType = 'oda'

export type ProductSource = {
  type: ProductType;
  uid: string;
  categoryName: string;
  subCategoryName: string;
}

export type Product= {
  uid: string;
  title: string;
  source?: ProductSource;
  info: ProductInfo;
  nutrition: NutritionInfo;
  unit: string;
  thumbnail: string;
};

