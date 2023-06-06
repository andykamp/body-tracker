export type AccessResponse = {
  refresh_token: string
  access_token: string
  expires_in: number
  access_token_created: number
  error?: string
}

export type Measurements = {
  weight?: any;
  fatMass?: any;
  muscleMass?: any;
}

