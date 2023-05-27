import * as t from '@/diet-server/diet.types'
import { v4 as uuid } from 'uuid';


function createDietItem(item: t.Meal | t.Product, type: t.ItemType): t.Item {
  return {
    id: uuid(),
    createdAt: new Date(),
    prosentage: 1,
    itemId: item.name,
    itemType: type,
    item: item
  }
}

const itemApi ={
  createDietItem
}

export type ItemApi = typeof itemApi;
export default itemApi
