import { useState } from 'react';
import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';
import BuchungsEntwurf from '../komponenten/BuchungsEntwurf.tsx';
import type { Buchungsentwurf } from '../komponenten/BuchungsEntwurf.tsx';

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
    </section>
  );
}

export default PlatzBuchung;
