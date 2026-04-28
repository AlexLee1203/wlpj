export type ExerciseLogRow = {
  id: string;
  user_id: string;
  name: string;
  duration_minutes: number;
  calories_burned: number;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
};

export type ExerciseLogInsert = {
  user_id: string;
  name: string;
  duration_minutes: number;
  calories_burned: number;
  completed?: boolean;
  date: string;
};
