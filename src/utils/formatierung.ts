// Hilfsfunktionen, damit alles schoen angezeigt wird
// (vorher stand ueberall 2026-11-21 und "spielen")

// "2026-11-21" -> "21.11.2026"
export function formatiereDatum(datum: string): string {
  const [jahr, monat, tag] = datum.split('-');
  return `${tag}.${monat}.${jahr}`;
}

// "2026-11-21" -> "Sa, 21.11.2026"
export function formatiereDatumMitTag(datum: string): string {
  // T12:00, damit die Zeitzone keinen anderen Tag draus macht
  const wochentag = new Date(`${datum}T12:00`).toLocaleDateString('de-AT', { weekday: 'short' });
  return `${wochentag}, ${formatiereDatum(datum)}`;
}

// "2026-11-21" -> "Sa 21.11." (kurz, fuer die Wetterleiste)
export function formatiereDatumKurz(datum: string): string {
  const [, monat, tag] = datum.split('-');
  const wochentag = new Date(`${datum}T12:00`).toLocaleDateString('de-AT', { weekday: 'short' });
  return `${wochentag} ${tag}.${monat}.`;
}

// 18 -> "18:00 Uhr"
export function formatiereUhrzeit(uhrzeit: number): string {
  return `${uhrzeit}:00 Uhr`;
}

// "spielen" -> "Spielen"
export function formatiereArt(art: 'spielen' | 'training'): string {
  return art === 'spielen' ? 'Spielen' : 'Training';
}

// "einzel" -> "Einzel"
export function formatiereSpielform(spielform: 'einzel' | 'doppel'): string {
  return spielform === 'einzel' ? 'Einzel' : 'Doppel';
}
