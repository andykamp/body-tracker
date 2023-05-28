import * as t from '@/diet-server/diet.types'

export const ITEM_TYPES: Record<string, t.ItemType> = {
  MEAL: 'meal',
  PRODUCT: 'product'
}
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
}

export const GOALS = {
  LOSE_EXTREME: 'extreme weightloss',
  LOSE: 'weightloss',
  MAINTAIN: 'maintain',
  GAIN: 'gain',
  GAIN_EXTREME: 'extreme gain'
}
