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
