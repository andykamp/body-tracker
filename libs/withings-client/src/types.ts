export type AccessResponse = {
  refresh_token: string
  access_token: string
  expires_in: number
  access_token_created: number
  error?: string
}

export type AccessResponseError = {
  error: string;
}


export type MeasurementState = {
  measurements: any,
  error?: string,
  isLoading: boolean
}

