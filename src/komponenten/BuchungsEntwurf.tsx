import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';

// Was fuer die Buchung schon bekannt ist (null = noch nicht ausgewaehlt)
export interface Buchungsentwurf {
  art: 'spielen' | 'training' | null;
  spielform: 'einzel' | 'doppel' | null;
  datum: string | null;
  uhrzeit: number | null;
  platzId: string | null;
  namen: string[];
  trainerId: string | null;
  geraete: string[];
}

interface BuchungsEntwurfProps {
  entwurf: Buchungsentwurf;
  onBuchen: () => void;
}

// Prueft, ob alles ausgefuellt ist, was man fuer eine Buchung braucht
function istVollstaendig(entwurf: Buchungsentwurf): boolean {
  if (!entwurf.art || !entwurf.datum || entwurf.uhrzeit === null || !entwurf.platzId) {
    return false;
  }
  if (entwurf.art === 'spielen') {
    // Einzel = 2 Spieler, Doppel = 4 Spieler
    if (entwurf.spielform === 'einzel') return entwurf.namen.length === 2;
    if (entwurf.spielform === 'doppel') return entwurf.namen.length === 4;
    return false;
  }
  // Training: 1 bis 4 Personen
  return entwurf.namen.length >= 1 && entwurf.namen.length <= 4;
}

function BuchungsEntwurf({ entwurf, onBuchen }: BuchungsEntwurfProps): React.JSX.Element {
  const platz = plaetze.find((p) => p.id === entwurf.platzId);
  const trainer = trainerListe.find((t) => t.id === entwurf.trainerId);
  const geraeteNamen = geraete
    .filter((g) => entwurf.geraete.includes(g.id))
    .map((g) => g.name);

  return (
    <div className='buchungs-entwurf'>
      <h3>Deine Buchung</h3>
      <p>Art: {entwurf.art ?? '– fehlt noch –'}</p>
      {entwurf.art === 'spielen' && <p>Spielform: {entwurf.spielform ?? '– fehlt noch –'}</p>}
      <p>Datum: {entwurf.datum ?? '– fehlt noch –'}</p>
      <p>Uhrzeit: {entwurf.uhrzeit !== null ? `${entwurf.uhrzeit}:00 Uhr` : '– fehlt noch –'}</p>
      <p>Platz: {platz ? platz.name : '– fehlt noch –'}</p>
      <p>Namen: {entwurf.namen.length > 0 ? entwurf.namen.join(', ') : '– fehlt noch –'}</p>
      {entwurf.art === 'training' && (
        <>
          <p>Trainer: {trainer ? `${trainer.name} (${trainer.fachgebiet})` : 'ohne Trainer'}</p>
          <p>Geräte: {geraeteNamen.length > 0 ? geraeteNamen.join(', ') : 'keine'}</p>
        </>
      )}
      <button onClick={onBuchen} disabled={!istVollstaendig(entwurf)}>
        Jetzt buchen
      </button>
    </div>
  );
}

export default BuchungsEntwurf;
