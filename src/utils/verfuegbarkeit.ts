// Prueft, ob eine Buchung wirklich moeglich ist
// (Bruno kann sich verrechnen, deshalb prueft hier nochmal der Code)
import type { Buchung, Buchungsentwurf } from '../typen/buchung.ts';
import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import { wetterMock } from '../daten/wetterMock.ts';


function datumAlsText(datum: Date): string {
  const jahr = datum.getFullYear();
  const monat = String(datum.getMonth() + 1).padStart(2, '0');
  const tag = String(datum.getDate()).padStart(2, '0');
  return `${jahr}-${monat}-${tag}`;
}

// nur von heute bis heute + 7 Tage
export function istImBuchungszeitraum(datum: string): boolean {
  const heute = new Date();
  const spaeter = new Date();
  spaeter.setDate(heute.getDate() + 7);
  // Texte im Format JJJJ-MM-TT kann man direkt vergleichen
  return datum >= datumAlsText(heute) && datum <= datumAlsText(spaeter);
}

// heute schon vorbei?
export function istUhrzeitVorbei(datum: string, uhrzeit: number): boolean {
  const jetzt = new Date();
  return datum === datumAlsText(jetzt) && uhrzeit <= jetzt.getHours();
}

// Aussenplatz bei Regen gesperrt
export function istAussenplatzGesperrt(platzId: string, datum: string): boolean {
  const platz = plaetze.find((p) => p.id === platzId);
  const wetter = wetterMock.find((w) => w.datum === datum);
  return platz?.art === 'aussen' && wetter?.wetter === 'regen';
}

export function istPlatzFrei(
  platzId: string,
  datum: string,
  uhrzeit: number,
  alleBuchungen: Buchung[]
): boolean {
  return !alleBuchungen.some(
    (b) => b.platzId === platzId && b.datum === datum && b.uhrzeit === uhrzeit
  );
}

export function istTrainerFrei(
  trainerId: string,
  datum: string,
  uhrzeit: number,
  alleBuchungen: Buchung[]
): boolean {
  const trainer = trainerListe.find((t) => t.id === trainerId);
  if (!trainer) return false;
  if (uhrzeit < trainer.vonUhr || uhrzeit > trainer.bisUhr) return false;
  return !alleBuchungen.some(
    (b) => b.trainerId === trainerId && b.datum === datum && b.uhrzeit === uhrzeit
  );
}

// wie viele Stueck von einem Geraet sind zu der Zeit noch frei
export function freieGeraete(
  geraetId: string,
  datum: string,
  uhrzeit: number,
  alleBuchungen: Buchung[]
): number {
  const geraet = geraete.find((g) => g.id === geraetId);
  if (!geraet) return 0;
  const belegt = alleBuchungen.filter(
    (b) => b.datum === datum && b.uhrzeit === uhrzeit && b.geraete.includes(geraetId)
  ).length;
  return geraet.anzahl - belegt;
}

// Prueft den ganzen Entwurf. Gibt eine Fehlermeldung zurueck oder null wenn alles passt.
export function pruefeEntwurf(entwurf: Buchungsentwurf, alleBuchungen: Buchung[]): string | null {
  const { datum, uhrzeit, platzId } = entwurf;
  if (!datum || uhrzeit === null || !platzId) {
    return 'Es fehlen noch Angaben.';
  }
  if (!istImBuchungszeitraum(datum)) {
    return 'Gebucht werden kann nur von heute bis 7 Tage im Voraus.';
  }
  if (uhrzeit < 8 || uhrzeit > 21) {
    return 'Gespielt werden kann nur von 8:00 bis 22:00 Uhr.';
  }
  if (istUhrzeitVorbei(datum, uhrzeit)) {
    return 'Diese Uhrzeit ist heute schon vorbei.';
  }
  if (istAussenplatzGesperrt(platzId, datum)) {
    return 'Wegen Regen sind die Außenplätze an diesem Tag gesperrt.';
  }
  if (!istPlatzFrei(platzId, datum, uhrzeit, alleBuchungen)) {
    return 'Der Platz ist zu dieser Zeit schon belegt.';
  }
  if (entwurf.art === 'training') {
    if (entwurf.trainerId && !istTrainerFrei(entwurf.trainerId, datum, uhrzeit, alleBuchungen)) {
      return 'Der Trainer hat zu dieser Zeit keine Zeit.';
    }
    for (const geraetId of entwurf.geraete) {
      if (freieGeraete(geraetId, datum, uhrzeit, alleBuchungen) < 1) {
        return 'Ein Trainingsgerät ist zu dieser Zeit schon vergeben.';
      }
    }
  }
  return null;
}
