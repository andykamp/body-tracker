import * as t from '@/withings/types'

export type AccessResponse = t.AccessResponse;

export type DataState = {
  data?: t.Data,
  error?: any,
  isLoading: boolean
}

