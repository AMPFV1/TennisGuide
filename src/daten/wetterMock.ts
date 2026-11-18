// Mock-Daten fuer das Wetter, bis der echte Wetter-Service eingebaut ist
import type { Wetter } from '../typen/buchung.ts';

export const wetterMock: Wetter[] = [
  { datum: '2026-11-18', wetter: 'sonnig', temperatur: 12 },
  { datum: '2026-11-19', wetter: 'bewoelkt', temperatur: 10 },
  { datum: '2026-11-20', wetter: 'regen', temperatur: 6 },
  { datum: '2026-11-21', wetter: 'regen', temperatur: 5 },
  { datum: '2026-11-22', wetter: 'bewoelkt', temperatur: 8 },
  { datum: '2026-11-23', wetter: 'sonnig', temperatur: 11 },
  { datum: '2026-11-24', wetter: 'sonnig', temperatur: 13 },
  { datum: '2026-11-25', wetter: 'bewoelkt', temperatur: 9 },
];
