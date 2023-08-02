import type * as t from "@/diet-server/diet.types"

export function normalizeJson(json: Record<string,any>){
  const normalized: t.StockStateNormalized<t.StockItem> = {
    allIds: [],
    byIds: {},
  };
  Object.entries(json).forEach(([id, item]) => {
    normalized.allIds.push(id);
    normalized.byIds[id] = item;
  });
  return normalized;
}

export function mergeNormalizedStates(...state: t.StockStateNormalized<t.StockItem>[]): t.StockStateNormalized<t.StockItem> {
  const mergedStockState: t.StockStateNormalized<t.StockItem> = {
    allIds: [],
    byIds: {},
  };

  state.forEach((s) => {
    mergedStockState.allIds.push(...s.allIds.filter((id) => !mergedStockState.allIds.includes(id)));
    Object.entries(s.byIds).forEach(([id, item]) => {
      mergedStockState.byIds[id] = item;
    });
  });

  return mergedStockState;
}


