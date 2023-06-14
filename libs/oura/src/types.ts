export type SleepData = {
  id: string;
  average_breath: number;
  average_heart_rate: number;
  average_hrv: number;
  awake_time: number;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  efficiency: number;
  heart_rate: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  hrv: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  latency: number;
  light_sleep_duration: number;
  low_battery_alert: boolean;
  lowest_heart_rate: number;
  movement_30_sec: string;
  period: number;
  readiness: {
    contributors: {
      activity_balance: string;
      body_temperature: string;
      hrv_balance: string;
      previous_day_activity: string;
      previous_night: string;
      recovery_index: string;
      resting_heart_rate: string;
      sleep_balance: string;
    },
    score: number;
    temperature_deviation: number;
    temperature_trend_deviation: number;
  };
  readiness_score_delta: number;
  rem_sleep_duration: number;
  restless_periods: number;
  sleep_phase_5_min: string;
  sleep_score_delta: number;
  time_in_bed: number;
  total_sleep_duration: number;
  type: string;
};

export type SleepDataResponse = {
  data: SleepData[];
  next_token: string;
};

export type SleepDailyData = {
  id: string;
  contributors: {
    deep_sleep: number;
    efficiency: number;
    latency: number;
    rem_sleep: number;
    restfulness: number;
    timing: number;
    total_sleep: number;
  };
  day: string;
  score: number;
  timestamp: string;
};

export type SleepDailyDataResponse = {
  data: SleepDailyData[];
  next_token: string;
};


export type Data = {
  sleep?: SleepDataResponse;
  sleepDaily?: SleepDailyDataResponse;
}
