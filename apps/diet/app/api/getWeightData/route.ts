// pages/api/getWeightData.js

import withingsApi from '@/withings/withings.api';
import { NextResponse } from 'next/server';


export async function POST(req: Request,) {
  const { accessToken } = await req.json() // res now contains body
  const measurements = await withingsApi.getMeasurements(accessToken)
  return NextResponse.json(measurements);

}


