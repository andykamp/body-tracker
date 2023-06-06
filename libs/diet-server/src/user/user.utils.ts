import type * as t from '@/diet-server/diet.types';

export type CreateUserObjectInput = {
  id: string;
  targetCalories?: number;
  targetProteins?: number;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: t.Zone;
  deficitOrSurplus?: number; // manual override
  caloryExpenditure?: number; // manual override
  withings?: t.Withings;
};

export function createUserObject({
  id,
  targetCalories=0,
  targetProteins=0,
  weight,
  height,
  age,
  gender,
  goal,
  deficitOrSurplus,
  caloryExpenditure,
  withings,
}: CreateUserObjectInput): t.User {
  const user: t.User = {
    id,
    targetCalories,
    targetProteins,
    weight,
    height,
    age,
    gender,
    goal,
    deficitOrSurplus,
    caloryExpenditure,
    withings,
  };

  return user;
}

