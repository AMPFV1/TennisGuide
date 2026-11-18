// Mock-Daten: Buchungen, die schon im System sind
import type { Buchung } from '../typen/buchung.ts';

export const belegungMock: Buchung[] = [
  { id: 1, art: 'spielen', datum: '2026-11-18', uhrzeit: 17, platzId: 'halle1', namen: ['Karl', 'Susi'], geraete: [] },
  { id: 2, art: 'spielen', datum: '2026-11-18', uhrzeit: 18, platzId: 'halle1', namen: ['Fritz', 'Hans', 'Eva', 'Lisa'], geraete: [] },
  { id: 3, art: 'training', datum: '2026-11-18', uhrzeit: 18, platzId: 'halle2', namen: ['Paul'], trainerId: 'max', geraete: ['ballmaschine'] },
  { id: 4, art: 'spielen', datum: '2026-11-19', uhrzeit: 10, platzId: 'platz1', namen: ['Gerda', 'Otto'], geraete: [] },
  { id: 5, art: 'training', datum: '2026-11-19', uhrzeit: 17, platzId: 'halle3', namen: ['Mia', 'Leo'], trainerId: 'john', geraete: ['ballwagen'] },
  { id: 6, art: 'spielen', datum: '2026-11-20', uhrzeit: 18, platzId: 'halle1', namen: ['Anna', 'Tom'], geraete: [] },
  { id: 7, art: 'spielen', datum: '2026-11-20', uhrzeit: 18, platzId: 'halle2', namen: ['Ben', 'Lena', 'Max', 'Sara'], geraete: [] },
  { id: 8, art: 'training', datum: '2026-11-20', uhrzeit: 17, platzId: 'halle3', namen: ['Julia'], trainerId: 'max', geraete: ['ballmaschine', 'zielscheiben'] },
  { id: 9, art: 'spielen', datum: '2026-11-21', uhrzeit: 19, platzId: 'halle2', namen: ['Kurt', 'Inge'], geraete: [] },
  { id: 10, art: 'training', datum: '2026-11-22', uhrzeit: 10, platzId: 'halle1', namen: ['Emil', 'Rosa', 'Felix'], trainerId: 'erika', geraete: ['ballwagen', 'koordination'] },
  { id: 11, art: 'spielen', datum: '2026-11-23', uhrzeit: 9, platzId: 'platz2', namen: ['Heinz', 'Waltraud'], geraete: [] },
  { id: 12, art: 'spielen', datum: '2026-11-23', uhrzeit: 16, platzId: 'platz1', namen: ['Nina', 'Jonas'], geraete: [] },
  { id: 13, art: 'training', datum: '2026-11-24', uhrzeit: 15, platzId: 'platz3', namen: ['Lukas'], trainerId: 'john', geraete: ['ballmaschine'] },
  { id: 14, art: 'spielen', datum: '2026-11-25', uhrzeit: 20, platzId: 'halle1', namen: ['Sophie', 'David'], geraete: [] },
];
