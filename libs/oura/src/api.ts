// import type * as t from '@/oura/types';
import config from '@/oura/config'

const getSleep = async (accessToken: string, startDate:string, endDate:string) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);

  // const startDate = '2021-11-01'
  // const endDate = '2021-12-01`'

  const requestOptions = {
    method: 'GET',
    headers: myHeaders
  }
  try {
    let res = await fetch(`${config.baseUrl}${config.sleepUrl}?start_date=${startDate}&end_date=${endDate}`, requestOptions)
    res = await res.json()
    return res
  } catch (e) {
    console.log(e)
    throw e
  }
}

const getData = (accessToken: string, startDate:string, endDate:string) => {
  return getSleep(accessToken, startDate, endDate)
}

const ouraApi = {
  getSleep,
  getData,
};

export type OuraApi = typeof ouraApi;
export default ouraApi;

