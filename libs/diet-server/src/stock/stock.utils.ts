import type * as t from "@/diet-server/diet.types"

export function mergeNormalizedStates(...state: t.StockStateNormalized[]): t.StockStateNormalized {
  const mergedStockState: t.StockStateNormalized = {
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


