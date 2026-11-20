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

function BuchungsEntwurf({ entwurf, onBuchen, isStreaming }: BuchungsEntwurfProps): React.JSX.Element {
  const platz = plaetze.find((p) => p.id === entwurf.platzId);
  const trainer = trainerListe.find((t) => t.id === entwurf.trainerId);
  const geraeteNamen = geraete
    .filter((g) => entwurf.geraete.includes(g.id))
    .map((g) => g.name);

  return (
    <div className='buchungs-entwurf'>
      <h3>Deine Buchung</h3>
      <p>Art: {entwurf.art ? formatiereArt(entwurf.art) : '– fehlt noch –'}</p>
      {entwurf.art === 'spielen' && (
        <p>Spielform: {entwurf.spielform ? formatiereSpielform(entwurf.spielform) : '– fehlt noch –'}</p>
      )}
      <p>Datum: {entwurf.datum ? formatiereDatumMitTag(entwurf.datum) : '– fehlt noch –'}</p>
      <p>Uhrzeit: {entwurf.uhrzeit !== null ? formatiereUhrzeit(entwurf.uhrzeit) : '– fehlt noch –'}</p>
      <p>Platz: {platz ? platz.name : '– fehlt noch –'}</p>
      <p>Namen: {entwurf.namen.length > 0 ? entwurf.namen.join(', ') : '– fehlt noch –'}</p>
      {entwurf.art === 'training' && (
        <>
          <p>Trainer: {trainer ? `${trainer.name} (${trainer.fachgebiet})` : 'ohne Trainer'}</p>
          <p>Geräte: {geraeteNamen.length > 0 ? geraeteNamen.join(', ') : 'keine'}</p>
        </>
      )}
      <button onClick={onBuchen} disabled={!istVollstaendig(entwurf) || isStreaming}>
        {isStreaming ? 'Bruno schreibt noch …' : 'Jetzt buchen'}
      </button>
    </div>
  );
}

export default BuchungsEntwurf;
