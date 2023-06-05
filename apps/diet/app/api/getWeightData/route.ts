// pages/api/getWeightData.js

import withingsApi from '@/withings/withings.api';
import { NextResponse } from 'next/server';

const MEASURE_TYPE = {
  weight: 1,
  fatMass: 8,
  muscleMass: 76,
}

type Measurements = {
  weight?: any;
  fatMass?: any;
  muscleMass?: any;
}

async function getMeasurements(accessToken: string) {
  const weight = await withingsApi.getMeasurements({
    accessToken,
    measureType: MEASURE_TYPE.weight,
  })

  const muscleMass = await withingsApi.getMeasurements({
    accessToken,
    measureType: MEASURE_TYPE.muscleMass,
  })

  const fatMass = await withingsApi.getMeasurements({
    accessToken,
    measureType: MEASURE_TYPE.fatMass,
  })

  const measurements: Measurements = {
    weight,
    muscleMass,
    fatMass,
  }

  return measurements;
}

export async function POST(req: Request,) {
  const { accessToken, refreshToken } = await req.json() // res now contains body

  let measurements: Measurements;
  try {
    measurements = await getMeasurements(accessToken)
  } catch (e) {
    const newAccessToken = await withingsApi.refreshAccessToken({ refreshToken })
    console.log('newAccessToken', newAccessToken);
    measurements = await getMeasurements(newAccessToken)
  }
  console.log('mea', measurements);
  return NextResponse.json(measurements);

}


