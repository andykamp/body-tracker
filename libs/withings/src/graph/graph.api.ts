import type * as t from '@/withings/types';
import { parseData, calculateWeeklyAverage } from '@/withings/graph/utils/utils.parser';

function getWeightData(data: t.MeasureGroup[]) {
  return parseData(data, 'weight')
}

function getFatMassData(data: t.MeasureGroup[]) {
  return parseData(data, 'fatMass')
}

function getMuscleMassData(data: t.MeasureGroup[]) {
  return parseData(data, 'muscleMass')
}

function getBodyCompositionData(
  fatMass: t.MeasureGroup[],
  muscleMass: t.MeasureGroup[]
) {
  const parsedFatMass = graphApi.getFatMassData(fatMass)
  const parsedMuscleMass = graphApi.getMuscleMassData(muscleMass);

  const parsedData = parsedFatMass.map((_, index) => ({ time: _.time, fatMass: _.fatMass, muscleMass: parsedMuscleMass[index].muscleMass }))
  return parsedData
}

function getWeekAvg(
  data:t.GraphData[]
) {
  return calculateWeeklyAverage(data)
}


const graphApi = {
  getWeightData,

  getFatMassData,
  getMuscleMassData,
  getBodyCompositionData,
  getWeekAvg
}

export type GraphApi = typeof graphApi;
export default graphApi;
