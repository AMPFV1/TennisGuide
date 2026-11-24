import type { Buchung, Buchungsentwurf, Kachel, Wetter } from '../typen/buchung.ts';
import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import { freieGeraete, istKachelGueltig } from '../utils/verfuegbarkeit.ts';

interface KachelListeProps {
  kacheln: Kachel[];
  entwurf: Buchungsentwurf;
  alleBuchungen: Buchung[];
  wetter: Wetter[];
  onKlick: (kachel: Kachel) => void;
  onGeraeteFertig?: () => void; // Button "Fertig" bei den Geraeten
}

// Text, der auf der Kachel steht
function kachelText(
  kachel: Kachel,
  entwurf: Buchungsentwurf,
  alleBuchungen: Buchung[],
  wetter: Wetter[]
): string {
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
    const tagWetter = wetter.find((w) => w.datum === kachel.datum);
    let icon = '';
    if (tagWetter?.wetter === 'sonnig') icon = ' ☀️';
    if (tagWetter?.wetter === 'bewoelkt') icon = ' ⛅';
    if (tagWetter?.wetter === 'regen') icon = ' 🌧️';
    if (tagWetter?.wetter === 'schnee') icon = ' ❄️';
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

function KachelListe({
  kacheln,
  entwurf,
  alleBuchungen,
  wetter,
  onKlick,
  onGeraeteFertig,
}: KachelListeProps): React.JSX.Element | null {
  if (kacheln.length === 0) return null;

  // bei Geraeten kann man mehrere auswaehlen und dann auf "Fertig" klicken
  const hatGeraete = kacheln.some((k) => k.typ === 'geraet');

  return (
    <div className='kachel-liste'>
      {kacheln.map((kachel, index) => {
        const ausgewaehlt = kachel.typ === 'geraet' && entwurf.geraete.includes(kachel.geraetId);
        // ein ausgewaehltes Geraet muss man immer wieder abwaehlen koennen
        const gueltig = ausgewaehlt || istKachelGueltig(kachel, entwurf, alleBuchungen, wetter);

        let klasse = 'kachel';
        if (!gueltig) klasse += ' kachel--belegt';
        if (ausgewaehlt) klasse += ' kachel--gewaehlt';

        return (
          // Index als key ist ok, die Liste wird jedes Mal komplett neu gesetzt
          <button
            key={index}
            className={klasse}
            onClick={() => onKlick(kachel)}
            disabled={!gueltig}
            aria-pressed={kachel.typ === 'geraet' ? ausgewaehlt : undefined}
          >
            {ausgewaehlt && '✔ '}
            {kachelText(kachel, entwurf, alleBuchungen, wetter)}
            {!gueltig && <small> – schon weg, Bruno hat Sand in den Augen 😅</small>}
          </button>
        );
      })}

      {hatGeraete && onGeraeteFertig && (
        <button className='kachel kachel--fertig' onClick={onGeraeteFertig}>
          {entwurf.geraete.length > 0 ? '👍 Fertig' : '🙅 Keine Geräte'}
        </button>
      )}
    </div>
  );
}

export default KachelListe;
