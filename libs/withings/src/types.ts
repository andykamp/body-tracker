export type AccessResponse = {
  refresh_token: string
  access_token: string
  expires_in: number
  access_token_created: number
  error?: string
}

export type Data = {
  weight?: GetMeasResponseBody;
  fatMass?: GetMeasResponseBody;
  muscleMass?: GetMeasResponseBody;
}

export type GetMeasInput = {
  action: string;
  meastypes: number | number[];
  category?: number;
  startdate?: number;
  enddate?: number;
  offset?: number;
  limit?: number;
};

export type GetMeasOutput = {
  status: number;
  body: GetMeasResponseBody;
  error?: any;
};

export type GetMeasResponseBody = {
  updatetime: string;
  timezone: string;
  measuregrps: MeasureGroup[];
  more: number;
  offset: number;
};

export type MeasureGroup = {
  grpid: number;
  attrib: number;
  date: number;
  created: number;
  modified: number;
  category: number;
  deviceid: string;
  measures: Measure[];
  comment?: string;
  timezone: string;
};

export type Measure = {
  value: number;
  type: number;
  unit: number;
  algo?: number;
  fm?: number;
  fw?: number;
};

export type GraphData = {
  time: number;
  [key: string]: number
}

