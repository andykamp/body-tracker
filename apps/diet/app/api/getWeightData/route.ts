// pages/api/getWeightData.js

import withingsApi from '@/withings/withings.api';
import { NextResponse } from 'next/server';

export async function POST(req: Request,) {
  const body = await req.json() // res now contains body
  console.log('body', body);
  const measurements = await withingsApi.getMeasurements(body)
  console.log('mea', measurements);
  return NextResponse.json(measurements);

}


