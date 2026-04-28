export type ExerciseLog = {
  id: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  completed: boolean;
  date: string;
};

export type ExerciseFormState = {
  name: string;
  durationMinutes: string;
  caloriesBurned: string;
};
