export interface Command {
  id: number;
  content: string;
  isHistory: boolean;
}

export const COMMANDS = {
  CLEAR: 'CLEAR',
  HIST_PREV: 'HIST_PREV',
  HIST_NEXT: 'HIST_NEXT'
}