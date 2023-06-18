import type * as t from '@/oura/types';
import config from '@/oura/config'
import { _fetch, parse } from '@/common/utils/utils.fetch'

async function getSleepDailyDocuments(accessToken: string, startDate: string, endDate: string) {
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
  const res = await _fetch(`${config.baseUrl}${config.sleepDailyUrl}?start_date=${startDate}&end_date=${endDate}`, requestOptions)
  return await parse(res as any)
}

async function getSleepDocuments(accessToken: string, startDate: string, endDate: string) {
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
  const res = await _fetch(`${config.baseUrl}${config.sleepUrl}?start_date=${startDate}&end_date=${endDate}`, requestOptions)
  return await parse(res as any)
}

async function getData(accessToken: string, startDate: string, endDate: string) {
  const sleepDailyPromise = getSleepDailyDocuments(accessToken, startDate, endDate)
  const sleepPromise = getSleepDocuments(accessToken, startDate, endDate)

  try {
    const [sleepDaily, sleep] = await Promise.all([
      sleepDailyPromise,
      sleepPromise
    ]);

    const data: t.Data = {
      sleep: sleep as t.SleepDataResponse,
      sleepDaily: sleepDaily as t.SleepDailyDataResponse,
    };

    return data;
  } catch (error) {
    // Handle the error here
    console.error('Error occurred while fetching data:', error);
    throw error; // Optional: Rethrow the error if needed
  }

}

const ouraApi = {
  getSleepDailyDocuments,
  getSleepDocuments,
  getData,
};

export type OuraApi = typeof ouraApi;
export default ouraApi;

