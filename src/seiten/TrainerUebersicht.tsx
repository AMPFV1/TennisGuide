// Seite mit allen Trainern
// (heisst nicht "Trainer.tsx", weil es den Typ Trainer schon gibt)
import { Link } from 'react-router-dom';
import { trainerListe } from '../daten/trainer.ts';

function TrainerUebersicht(): React.JSX.Element {
  return (
    <>
      <section className='hero' aria-label='Unsere Trainer'>
        <h2>Unsere Trainer</h2>
        <p>
          Ob Anfänger oder Turnierprofi – unsere Trainer bringen dich weiter. Ein Training
          dauert immer eine Stunde und findet auf einem unserer Plätze statt. Gebucht wird
          über unseren Platzwart Bruno.
        </p>
      </section>

      <section className='karten' aria-label='Liste der Trainer'>
        {trainerListe.map((trainer) => (
          <article key={trainer.id} className='karte'>
            <h3>{trainer.name}</h3>
            <p>
              <strong>Fachgebiet:</strong> {trainer.fachgebiet}
            </p>
            <p>
              {/* bisUhr ist die letzte Stunde, die man buchen kann, deshalb + 1 */}
              <strong>Zeiten:</strong> täglich {trainer.vonUhr}:00 bis {trainer.bisUhr + 1}:00 Uhr
            </p>
            <p>
              {/* state: die Buchungsseite weiss dann, welcher Trainer gemeint ist */}
              <Link className='button' to='/plaetze' state={{ trainerId: trainer.id }}>
                Training mit {trainer.name.split(' ')[0]} buchen
              </Link>
            </p>
          </article>
        ))}
      </section>
    </>
  );
}

export default TrainerUebersicht;
