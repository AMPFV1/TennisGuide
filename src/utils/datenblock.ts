// Bruno haengt am Ende seiner Antwort einen Block an:
// <daten>{"entwurf": { ... }}</daten>
// Der soll im Chat nicht zu sehen sein, aber wir lesen ihn aus.
import type { Buchungsentwurf } from '../typen/buchung.ts';

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

// Liest den Block aus und gibt nur die Felder zurueck, die auch Sinn ergeben
export function leseDatenblock(text: string): Partial<Buchungsentwurf> | null {
  const treffer = text.match(/<daten>([\s\S]*?)<\/daten>/);
  if (!treffer) return null;

  const jsonText = treffer[1].replace(/```json|```/g, '').trim();

  let daten;
  try {
    daten = JSON.parse(jsonText);
  } catch {
    return null;
  }

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
