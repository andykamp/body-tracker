import type * as t from '@/oura/types';
import { parseSleepData, parseSleepDataWeeklyAverage } from '@/oura/graph/utils/utils.sleep';


function getSleepData(data: t.SleepData[]) {
  return parseSleepData(data)
}

function getSleepDataWeeklyAverage(data: t.SleepData[]) {
  const parsedData = graphApi.getSleepData(data);
  const parsedWeekData = parseSleepDataWeeklyAverage(parsedData);
  return parsedWeekData
}

const graphApi = {
  getSleepData,
  getSleepDataWeeklyAverage,

}

export type GraphApi = typeof graphApi;
export default graphApi;
