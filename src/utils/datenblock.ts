// Bruno haengt am Ende seiner Antwort einen Block an:
// <daten>{"entwurf": { ... }}</daten>
// Der soll im Chat nicht zu sehen sein, aber wir lesen ihn aus.
import type { Buchungsentwurf, Kachel } from '../typen/buchung.ts';

const START = '<daten>';

// Text ohne den Datenblock (fuer die Anzeige im Chat)
export function entferneDatenblock(text: string): string {
  const index = text.indexOf(START);
  if (index !== -1) {
    return text.slice(0, index).trim();
  }

  // Beim Streamen kommt der Block Stueck fuer Stueck, z.B. erst nur "<da".
  // Das soll auch nicht kurz aufblitzen.
  for (let i = START.length - 1; i > 0; i--) {
    if (text.endsWith(START.slice(0, i))) {
      return text.slice(0, text.length - i).trim();
    }
  }
  return text;
}

// JSON aus dem Block holen (wird fuer Entwurf und Kacheln gebraucht)
function holeJson(text: string): any {
  const treffer = text.match(/<daten>([\s\S]*?)<\/daten>/);
  if (!treffer) return null;

  const jsonText = treffer[1].replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

// Liest den Block aus und gibt nur die Felder zurueck, die auch Sinn ergeben
export function leseDatenblock(text: string): Partial<Buchungsentwurf> | null {
  const daten = holeJson(text);
  const e = daten?.entwurf;
  if (!e || typeof e !== 'object') return null;

  // nur uebernehmen, was den richtigen Typ hat
  const ergebnis: Partial<Buchungsentwurf> = {};
  if (e.art === 'spielen' || e.art === 'training') ergebnis.art = e.art;
  if (e.spielform === 'einzel' || e.spielform === 'doppel') ergebnis.spielform = e.spielform;
  if (typeof e.datum === 'string') ergebnis.datum = e.datum;
  if (typeof e.uhrzeit === 'number') ergebnis.uhrzeit = e.uhrzeit;
  if (typeof e.platzId === 'string') ergebnis.platzId = e.platzId;
  if (Array.isArray(e.namen)) ergebnis.namen = e.namen.filter((n: unknown) => typeof n === 'string');
  if (typeof e.trainerId === 'string') ergebnis.trainerId = e.trainerId;
  if (Array.isArray(e.geraete)) ergebnis.geraete = e.geraete.filter((g: unknown) => typeof g === 'string');

  return ergebnis;
}

// Liest die Kacheln aus dem Block (Vorschlaege zum Anklicken)
export function leseKacheln(text: string): Kachel[] {
  const daten = holeJson(text);
  if (!daten || !Array.isArray(daten.kacheln)) return [];

  const kacheln: Kachel[] = [];
  for (const k of daten.kacheln) {
    if (!k || typeof k !== 'object') continue;

    if (k.typ === 'art' && (k.art === 'spielen' || k.art === 'training')) {
      kacheln.push({ typ: 'art', art: k.art });
    } else if (k.typ === 'spielform' && (k.spielform === 'einzel' || k.spielform === 'doppel')) {
      kacheln.push({ typ: 'spielform', spielform: k.spielform });
    } else if (
      k.typ === 'termin' &&
      typeof k.datum === 'string' &&
      typeof k.uhrzeit === 'number' &&
      typeof k.platzId === 'string'
    ) {
      kacheln.push({ typ: 'termin', datum: k.datum, uhrzeit: k.uhrzeit, platzId: k.platzId });
    } else if (k.typ === 'trainer' && (typeof k.trainerId === 'string' || k.trainerId === null)) {
      kacheln.push({ typ: 'trainer', trainerId: k.trainerId });
    } else if (k.typ === 'geraet' && typeof k.geraetId === 'string') {
      kacheln.push({ typ: 'geraet', geraetId: k.geraetId });
    }
  }

  // nicht zu viele, sonst wird es unuebersichtlich
  return kacheln.slice(0, 6);
}
