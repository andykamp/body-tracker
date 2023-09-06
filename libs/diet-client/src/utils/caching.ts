type AddToCacheOnMutateInput = {
  queryClient: any,
  mutatedObj: any,
  cacheKey: string | string[],
}

export async function addToCacheOnMutate({
  queryClient,
  mutatedObj,
  cacheKey,
}: AddToCacheOnMutateInput) {
  // Snapshot the previous value
  const prevCache = queryClient.getQueryData(cacheKey)

  // Optimistically update to the new value
  const updatedCache = [...prevCache, mutatedObj]
  queryClient.setQueryData(cacheKey, updatedCache)

  // @todo: why do in need this?
  return { prevCache }
}

export function findById(id: string, items: { id: string }[]) {
  return items.find((item) => item.id === id);
}

export function findIndexById(id: string, items: { id: string }[]) {
  return items.findIndex((item) => item.id === id);
}

type UpdateCacheOnMutateInput = {
  queryClient: any,
  mutatedObj: any,
  cacheKey: string | string[],
  findIndex?: (id: string, obj: any) => number
}

export async function updateCacheOnMutate({
  queryClient,
  mutatedObj,
  cacheKey,
  findIndex = findIndexById
}: UpdateCacheOnMutateInput) {
  // Snapshot the previous value
  const prevCache = queryClient.getQueryData(cacheKey)

  // find the relevant entry in the array
  if (Array.isArray(prevCache)) {
    const updatedCache = [...prevCache]
    const index = findIndex(mutatedObj.id, updatedCache)

    if (index !== -1) {
      updatedCache[index] = {
        ...updatedCache[index],
        ...mutatedObj,
      }
      // Optimistically update to the new value
      queryClient.setQueryData(cacheKey, updatedCache)
    }
  }
  // replace the entire cache object
  else {
    queryClient.setQueryData(cacheKey, mutatedObj)
  }

  // @todo: why do in need this?
  return { prevCache }
}

type RemoveFromCacheOnMutateInput = {
  queryClient: any,
  mutatedObj: any,
  cacheKey: string | string[],
  keyToMatch?: string
}

export async function removeFromCacheOnMutate({
  queryClient,
  mutatedObj,
  cacheKey,
  keyToMatch = "id"
}: RemoveFromCacheOnMutateInput) {
  // Snapshot the previous value
  const prevCache = queryClient.getQueryData(cacheKey)

  // Optimistically update to the new value
  const updatedCache = prevCache.filter((o: any) => o[keyToMatch] !== mutatedObj[keyToMatch])
  queryClient.setQueryData(cacheKey, updatedCache)
}
