import { useState } from 'react';

interface TrainerProps {
  name: string;
  fachgebiet: string;
  erfahrung: number; // in Jahren
}

const trainerListe: TrainerProps[] = [
  { name: 'Max Mustermann', fachgebiet: 'Grundlagen', erfahrung: 5 },
  { name: 'Erika Musterfrau', fachgebiet: 'Schläge', erfahrung: 3 },
  { name: 'John Doe', fachgebiet: 'Training', erfahrung: 4 },
  { name: 'Jane Smith', fachgebiet: 'Fitness', erfahrung: 6 },
];

function formatTrainer(trainer: TrainerProps): string {
  return `${trainer.name} - ${trainer.fachgebiet} (${trainer.erfahrung} Jahre Erfahrung)`;
}

function pruefeBuchung(trainer: TrainerProps | undefined, datum: string): string {
  if (!trainer) {
    return 'Bitte wählen Sie einen Trainer aus.';
  } else if (!datum) {
    return 'Bitte wählen Sie ein Datum aus.';
  } else if (new Date(`${datum}T17:00`).getTime() < Date.now()) {
    return 'Bitte wählen Sie ein zukünftiges Datum aus.';
  } else {
    return `Trainer ${trainer.name} wurde für ${datum} erfolgreich gebucht!`;
  }
}

function TrainerBuchung(): React.JSX.Element {
  // Statt document.getElementById merkt sich React die Eingaben im State
  const [datum, setDatum] = useState<string>('');
  const [trainerName, setTrainerName] = useState<string>('');
  const [meldung, setMeldung] = useState<string>('');

  const handleBuchen = (): void => {
    const ausgewaehlterTrainer = trainerListe.find(
      (trainer) => trainer.name === trainerName
    );
    setMeldung(pruefeBuchung(ausgewaehlterTrainer, datum));
  };

  // Erfolg grün, Fehler rot (wie in der alten Version)
  const erfolgreich: boolean = meldung.includes('erfolgreich gebucht');

  return (
    <>
      <section id='kontakt' aria-label='Bereich Kontakt'>
        <h2>Trainer buchen</h2>
        <article>
          <p>
            Trainer können täglich für eine Stunde von 17:00Uhr bis 18:00Uhr
            gebucht werden.
          </p>
          <p>Es stehen 4 Trainer mit unterschiedlichen Fachgebieten zur Verfügung.</p>
        </article>
      </section>

      <h3>Trainer direkt auswählen und buchen</h3>
      <label htmlFor='date'>Wählen Sie ein Datum:</label>
      <input
        type='date'
        id='date'
        name='date'
        required
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
      />

      <label htmlFor='trainer'>Wählen Sie einen Trainer:</label>
      <select
        id='trainer'
        name='trainer'
        required
        value={trainerName}
        onChange={(e) => setTrainerName(e.target.value)}
      >
        <option value=''>--Bitte wählen--</option>
        {trainerListe.map((trainer) => (
          <option key={trainer.name} value={trainer.name}>
            {formatTrainer(trainer)}
          </option>
        ))}
      </select>

      <button id='btnBuchen' onClick={handleBuchen}>
        Buchen
      </button>

      {meldung && (
        <article
          id='buchungsInfo'
          className={erfolgreich ? 'erfolg' : 'fehler'}
          aria-live='polite'
        >
          {meldung}
        </article>
      )}
    </>
  );
}

export default TrainerBuchung;
