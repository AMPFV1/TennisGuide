//Rolle
export type Rolle = 'system' | 'user' | 'assistant';

//Nachricht
export interface Nachricht {
  role: Rolle;
  content: string;
}
