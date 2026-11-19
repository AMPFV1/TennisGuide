// Typen fuer die Platzbuchung

export interface Platz {
  id: string;
  name: string;
  art: 'aussen' | 'halle';
  belag: string;
}

export interface Trainer {
  id: string;
  name: string;
  fachgebiet: string;
  vonUhr: number; // arbeitet ab dieser Stunde
  bisUhr: number; // letzte Stunde, die man buchen kann
}

export interface Geraet {
  id: string;
  name: string;
  anzahl: number; // wie viele gibt es davon im Verein
}

export interface Wetter {
  datum: string; // JJJJ-MM-TT
  wetter: 'sonnig' | 'bewoelkt' | 'regen';
  temperatur: number;
}

// Was fuer die Buchung schon bekannt ist (null = noch nicht ausgewaehlt)
// (war vorher in BuchungsEntwurf.tsx, wird jetzt aber auch woanders gebraucht)
export interface Buchungsentwurf {
  art: 'spielen' | 'training' | null;
  spielform: 'einzel' | 'doppel' | null;
  datum: string | null;
  uhrzeit: number | null;
  platzId: string | null;
  namen: string[];
  trainerId: string | null;
  geraete: string[];
}

// Eine Kachel, die Bruno vorschlaegt und die man anklicken kann
export type Kachel =
  | { typ: 'art'; art: 'spielen' | 'training' }
  | { typ: 'spielform'; spielform: 'einzel' | 'doppel' }
  | { typ: 'termin'; datum: string; uhrzeit: number; platzId: string }
  | { typ: 'trainer'; trainerId: string | null } // null = ohne Trainer
  | { typ: 'geraet'; geraetId: string };

// Eine Buchung, die schon im System ist
export interface Buchung {
  id: number;
  art: 'spielen' | 'training';
  datum: string; // JJJJ-MM-TT
  uhrzeit: number; // 8 bis 21, eine Stunde
  platzId: string;
  namen: string[];
  trainerId?: string;
  geraete: string[]; // ids der Geraete
}
