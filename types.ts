
export interface UserState {
  balance: number;
  level: number;
  xp: number;
  language: string;
  country: string;
  tasksCompleted: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  type: 'trivia' | 'creative' | 'logic' | 'photo';
  status: 'available' | 'completed' | 'pending';
}

export interface Prize {
  id: string;
  name: string;
  cost: number;
  image: string;
  category: string;
}

export type AppView = 'dashboard' | 'tasks' | 'prizes' | 'settings';
