export interface GridBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  widget?: {
    type: 'clock' | 'pomodoro' | 'notes' | 'todo' | 'music' | 'radio';
    data?: Record<string, unknown>;
  };
}

export interface Position {
  x: number;
  y: number;
}
