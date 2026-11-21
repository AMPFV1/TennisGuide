import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import type { Buchungsentwurf } from '../typen/buchung.ts';
import {
  formatiereArt,
  formatiereDatumMitTag,
  formatiereSpielform,
  formatiereUhrzeit,
} from '../utils/formatierung.ts';
import { istVollstaendig } from '../utils/verfuegbarkeit.ts';

interface BuchungsEntwurfProps {
  entwurf: Buchungsentwurf;
  onBuchen: () => void;
  isStreaming: boolean; // solange Bruno schreibt, nicht buchen
}

// Eine Zeile der Checkliste: ✔ mit Wert oder "fehlt noch" (Text, nicht nur Farbe)
function zeile(bezeichnung: string, wert: string | null): React.JSX.Element {
  return (
    <>
      <dt>{bezeichnung}</dt>
      <dd className={wert ? 'entwurf-ok' : 'entwurf-fehlt'}>{wert ?? 'fehlt noch'}</dd>
    </>
  );
}

function BuchungsEntwurf({ entwurf, onBuchen, isStreaming }: BuchungsEntwurfProps): React.JSX.Element {
  const platz = plaetze.find((p) => p.id === entwurf.platzId);
  const trainer = trainerListe.find((t) => t.id === entwurf.trainerId);
  const geraeteNamen = geraete
    .filter((g) => entwurf.geraete.includes(g.id))
    .map((g) => g.name);

  return (
    <div className='buchungs-entwurf'>
      <h3>Deine Buchung</h3>
      <dl className='entwurf-liste'>
        {zeile('Art', entwurf.art ? formatiereArt(entwurf.art) : null)}
        {entwurf.art === 'spielen' &&
          zeile('Spielform', entwurf.spielform ? formatiereSpielform(entwurf.spielform) : null)}
        {zeile('Datum', entwurf.datum ? formatiereDatumMitTag(entwurf.datum) : null)}
        {zeile('Uhrzeit', entwurf.uhrzeit !== null ? formatiereUhrzeit(entwurf.uhrzeit) : null)}
        {zeile('Platz', platz ? platz.name : null)}
        {zeile('Namen', entwurf.namen.length > 0 ? entwurf.namen.join(', ') : null)}
        {entwurf.art === 'training' && (
          <>
            <dt>Trainer</dt>
            <dd>{trainer ? `${trainer.name} (${trainer.fachgebiet})` : 'ohne Trainer'}</dd>
            <dt>Geräte</dt>
            <dd>{geraeteNamen.length > 0 ? geraeteNamen.join(', ') : 'keine'}</dd>
          </>
        )}
      </dl>
      <button onClick={onBuchen} disabled={!istVollstaendig(entwurf) || isStreaming}>
        {isStreaming ? 'Bruno schreibt noch …' : 'Jetzt buchen'}
      </button>
    </div>
  );
}

export default BuchungsEntwurf;
