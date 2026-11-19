import { useState } from 'react';
import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';
import BuchungsEntwurf from '../komponenten/BuchungsEntwurf.tsx';
import BuchungsListe from '../komponenten/BuchungsListe.tsx';
import type { Buchung, Buchungsentwurf } from '../typen/buchung.ts';
import useAI from '../hooks/useAI.ts';
import { erstelleBrunoPrompt } from '../utils/brunoPrompt.ts';
import { leseDatenblock } from '../utils/datenblock.ts';

function PlatzBuchung(): React.JSX.Element {
  const leererEntwurf: Buchungsentwurf = {
    art: null,
    spielform: null,
    datum: null,
    uhrzeit: null,
    platzId: null,
    namen: [],
    trainerId: null,
    geraete: [],
  };

  // jetzt fuellt Bruno den Entwurf, deshalb keine Testdaten mehr
  const [entwurf, setEntwurf] = useState<Buchungsentwurf>(leererEntwurf);

  // meine eigenen Buchungen (zum Testen eine Beispielbuchung)
  const [buchungen, setBuchungen] = useState<Buchung[]>([
    { id: 1, art: 'spielen', datum: '2026-11-22', uhrzeit: 15, platzId: 'halle3', namen: ['Jürgen', 'Tom'], geraete: [] },
  ]);

  // Chat mit Bruno ist jetzt hier, damit Bruno auch meine Buchungen kennt
  const { nachrichten, isStreaming, fehler, sendeNachricht, zuruecksetzen } = useAI({
    systemPrompt: erstelleBrunoPrompt(buchungen),
    // wenn Bruno fertig ist, seinen Datenblock in den Entwurf uebernehmen
    onAntwortFertig: (antwort) => {
      const daten = leseDatenblock(antwort);
      if (daten) {
        setEntwurf((prev) => ({ ...prev, ...daten }));
      }
    },
  });

  const handleBuchen = (): void => {
    if (!entwurf.art || !entwurf.datum || entwurf.uhrzeit === null || !entwurf.platzId) {
      return;
    }

    const neueBuchung: Buchung = {
      id: Date.now(),
      art: entwurf.art,
      datum: entwurf.datum,
      uhrzeit: entwurf.uhrzeit,
      platzId: entwurf.platzId,
      namen: entwurf.namen,
      geraete: entwurf.geraete,
    };
    if (entwurf.trainerId) {
      neueBuchung.trainerId = entwurf.trainerId;
    }

    setBuchungen([...buchungen, neueBuchung]);
    setEntwurf(leererEntwurf);
  };

  const handleStornieren = (id: number): void => {
    setBuchungen(buchungen.filter((b) => b.id !== id));
  };

  return (
    <section>
      <h2>Platz buchen</h2>
      <p>
        Sag unserem Platzwart Bruno, wann du spielen oder trainieren willst. Er
        trägt alles bei "Deine Buchung" ein, du musst nur noch auf "Jetzt buchen" klicken.
      </p>
      <h3>Wetter</h3>
      <WetterLeiste />
      <Chatbox
        nachrichten={nachrichten}
        isStreaming={isStreaming}
        fehler={fehler}
        onSenden={sendeNachricht}
        onZuruecksetzen={zuruecksetzen}
      />
      <BuchungsEntwurf entwurf={entwurf} onBuchen={handleBuchen} />
      <BuchungsListe buchungen={buchungen} onStornieren={handleStornieren} />
    </section>
  );
}

export default PlatzBuchung;
