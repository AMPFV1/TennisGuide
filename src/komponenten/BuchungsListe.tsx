import type { Buchung } from '../typen/buchung.ts';
import { plaetze } from '../daten/plaetze.ts';
import { formatiereArt, formatiereDatumMitTag, formatiereUhrzeit } from '../utils/formatierung.ts';

interface BuchungsListeProps {
  buchungen: Buchung[];
  onStornieren: (id: number) => void;
}

function BuchungsListe({ buchungen, onStornieren }: BuchungsListeProps): React.JSX.Element {
  return (
    <div className='buchungs-liste'>
      <h3>Meine Buchungen</h3>

      {buchungen.length === 0 && <p>Du hast noch nichts gebucht.</p>}

      <ul>
        {buchungen.map((buchung) => {
          const platz = plaetze.find((p) => p.id === buchung.platzId);
          return (
            <li key={buchung.id}>
              {formatiereDatumMitTag(buchung.datum)} um {formatiereUhrzeit(buchung.uhrzeit)} –{' '}
              {platz?.name} – {formatiereArt(buchung.art)} –{' '}
              {buchung.namen.join(', ')}{' '}
              <button onClick={() => onStornieren(buchung.id)}>Stornieren</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BuchungsListe;
