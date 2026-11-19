import type { Buchung, Buchungsentwurf, Kachel } from '../typen/buchung.ts';
import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import { wetterMock } from '../daten/wetterMock.ts';
import { freieGeraete, istKachelGueltig } from '../utils/verfuegbarkeit.ts';

interface KachelListeProps {
  kacheln: Kachel[];
  entwurf: Buchungsentwurf;
  alleBuchungen: Buchung[];
  onKlick: (kachel: Kachel) => void;
}


// Text, der auf der Kachel steht
function kachelText(kachel: Kachel, entwurf: Buchungsentwurf, alleBuchungen: Buchung[]): string {
  if (kachel.typ === 'art') {
    return kachel.art === 'spielen' ? '🎾 Spielen' : '🏋️ Training';
  }
  if (kachel.typ === 'spielform') {
    return kachel.spielform === 'einzel' ? 'Einzel (2 Personen)' : 'Doppel (4 Personen)';
  }
  if (kachel.typ === 'termin') {
    const platz = plaetze.find((p) => p.id === kachel.platzId);
    // T12:00 damit es keine Probleme mit der Zeitzone gibt
    const tag = new Date(`${kachel.datum}T12:00`).toLocaleDateString('de-AT', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
    const wetter = wetterMock.find((w) => w.datum === kachel.datum);
    let icon = '';
    if (wetter?.wetter === 'sonnig') icon = ' ☀️';
    if (wetter?.wetter === 'bewoelkt') icon = ' ⛅';
    if (wetter?.wetter === 'regen') icon = ' 🌧️';
    return `${tag} · ${kachel.uhrzeit}:00 · ${platz?.name ?? kachel.platzId}${icon}`;
  }
  if (kachel.typ === 'trainer') {
    if (kachel.trainerId === null) return '🙅 Ohne Trainer';
    const trainer = trainerListe.find((t) => t.id === kachel.trainerId);
    return trainer ? `🧑‍🏫 ${trainer.name} · ${trainer.fachgebiet}` : kachel.trainerId;
  }
  // Geraet
  const geraet = geraete.find((g) => g.id === kachel.geraetId);
  let text = geraet?.name ?? kachel.geraetId;
  if (entwurf.datum && entwurf.uhrzeit !== null) {
    const frei = freieGeraete(kachel.geraetId, entwurf.datum, entwurf.uhrzeit, alleBuchungen);
    text += ` (${Math.max(frei, 0)} frei)`;
  }
  return text;
}

function KachelListe({ kacheln, entwurf, alleBuchungen, onKlick }: KachelListeProps): React.JSX.Element | null {
  if (kacheln.length === 0) return null;

  return (
    <div className='kachel-liste'>
      {kacheln.map((kachel, index) => {
        const gueltig = istKachelGueltig(kachel, entwurf, alleBuchungen);
        return (
          // Index als key ist ok, die Liste wird jedes Mal komplett neu gesetzt
          <button
            key={index}
            className={gueltig ? 'kachel' : 'kachel kachel--belegt'}
            onClick={() => onKlick(kachel)}
            disabled={!gueltig}
          >
            {kachelText(kachel, entwurf, alleBuchungen)}
            {!gueltig && <small> – schon weg, Bruno hat Sand in den Augen 😅</small>}
          </button>
        );
      })}
    </div>
  );
}

export default KachelListe;
