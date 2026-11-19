import { useState } from 'react';
import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';
import BuchungsEntwurf from '../komponenten/BuchungsEntwurf.tsx';
import type { Buchungsentwurf } from '../komponenten/BuchungsEntwurf.tsx';
import BuchungsListe from '../komponenten/BuchungsListe.tsx';
import type { Buchung } from '../typen/buchung.ts';

function PlatzBuchung(): React.JSX.Element {
  // zum Testen erstmal mit Beispieldaten
  const [entwurf] = useState<Buchungsentwurf>({
    art: 'training',
    spielform: null,
    datum: '2026-11-21',
    uhrzeit: 18,
    platzId: 'halle1',
    namen: [],
    trainerId: 'max',
    geraete: ['ballmaschine'],
  });

  // meine eigenen Buchungen (zum Testen eine Beispielbuchung)
  const [buchungen, setBuchungen] = useState<Buchung[]>([
    { id: 1, art: 'spielen', datum: '2026-11-22', uhrzeit: 15, platzId: 'halle3', namen: ['Jürgen', 'Tom'], geraete: [] },
  ]);

  const handleStornieren = (id: number): void => {
    setBuchungen(buchungen.filter((b) => b.id !== id));
  };

  return (
    <section>
      <h2>Platz buchen</h2>
      <p>
        Fragen zu unseren Plätzen? Unser Platzwart Bruno hilft dir gerne weiter.
        Bald kann er auch direkt für dich reservieren.
      </p>
      <h3>Wetter</h3>
      <WetterLeiste />
      <Chatbox />
      <BuchungsEntwurf entwurf={entwurf} />
      <BuchungsListe buchungen={buchungen} onStornieren={handleStornieren} />
    </section>
  );
}

export default PlatzBuchung;
