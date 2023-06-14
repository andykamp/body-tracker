// pages/api/getWithingsData.js

import ouraApi from '@/oura/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request,) {
  const { accessToken, startDate, endDate} = await req.json()
  const data = await ouraApi.getData(accessToken, startDate, endDate)
  return NextResponse.json(data);
}


