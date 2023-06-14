// pages/api/getWithingsData.js

import withingsApi from '@/withings/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request,) {
  const { accessToken } = await req.json()
  const data = await withingsApi.getData(accessToken)
  return NextResponse.json(data);
}


