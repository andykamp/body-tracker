export type ProductSources = 'oda' | 'matvaretabellen'

export const PRODUCT_SOURCES: Record<ProductSources, ProductSources> = {

  oda: 'oda',
  matvaretabellen: 'matvaretabellen',
}

export type Unit = 'grams'

export const UNITS: Record<Unit, Unit> = {
  grams: 'grams',
}
