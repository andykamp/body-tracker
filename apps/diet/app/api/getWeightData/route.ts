// pages/api/getWeightData.js

import withingsApi from '@/withings/withings.api';
import { NextResponse } from 'next/server';

export async function POST(req: Request,) {
  const { accessToken, refreshToken, measureType, userId } = await req.json() // res now contains body
  let measurements;
  try {
    measurements = await withingsApi.getMeasurements({
      accessToken,
      measureType,
    })
  } catch (e) {
    const newAccessToken = await withingsApi.refreshAccessToken({ refreshToken })
    console.log('newAccessToken', newAccessToken);
    measurements = await withingsApi.getMeasurements({
      accessToken: newAccessToken,
      measureType
    })
  }
  console.log('mea', measurements);
  return NextResponse.json(measurements);

}


