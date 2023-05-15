import * as t from '@/diet-server/diet.types'

export const STOCK_MEALS: t.StockStateNormalized = {
  allIds: [
    "SmallMealsCottageCheese",
    "SmallMealsCottageCheeseWithPB",
    "SmallMealsKesam",
    "SmallMealsFetaSalad",
    "TacoNachos",
    "Beef"
  ],
  byIds: {
    "SmallMealsCottageCheese": {
      "name": "SmallMealsCottageCheese",
      "products": [
        "CottageCheeseOriginal",
        "CottageCheeseMager"
      ],
      "protein": 106,
      "calories": 700,
      "totalGrams": 800
    },
    "SmallMealsCottageCheeseWithPB": {
      "name": "SmallMealsCottageCheeseWithPB",
      "products": [
        "CottageCheeseMager",
        "PeanutSmør",
        "Syltetøy"
      ],
      "protein": 55.6,
      "calories": 407,
      "totalGrams": 415
    },
    "SmallMealsKesam": {
      "name": "SmallMealsKesam",
      "products": [
        "Kesam"
      ],
      "protein": 24,
      "calories": 468,
      "totalGrams": 400
    },
    "SmallMealsFetaSalad": {
      "name": "SmallMealsFetaSalad",
      "products": [
        "FetaBoksOriginal",
        "FetaBoksMager",
        "PinjeKjerner",
        "Jalapenos"
      ],
      "protein": 35.5,
      "calories": 843,
      "totalGrams": 570
    },
    "TacoNachos": {
      "name": "TacoNachos",
      "products": [
        "KjøttdeigSvin",
        "RevetOst",
        "RømmeQDrømmelett",
        "TacoKrydder",
        "GuacamoleFerdigdip",
        "TortillaChips"
      ],
      "protein": 117,
      "calories": 1800,
      "totalGrams": 1690
    },
    "Beef": {
      "name": "Beef",
      "products": [
        "Kyllingfilet",
        "Svinekoteletter",
        "SvinIndrefilet"
      ],
      "protein": 798,
      "calories": 3804,
      "totalGrams": 2400
    }
  }

}
