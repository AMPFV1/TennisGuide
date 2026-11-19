import { useState } from 'react';
import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';
import BuchungsEntwurf from '../komponenten/BuchungsEntwurf.tsx';
import BuchungsListe from '../komponenten/BuchungsListe.tsx';
import type { Buchung, Buchungsentwurf } from '../typen/buchung.ts';
import useAI from '../hooks/useAI.ts';
import { erstelleBrunoPrompt } from '../utils/brunoPrompt.ts';
import { leseDatenblock } from '../utils/datenblock.ts';
import { plaetze } from '../daten/plaetze.ts';
import { belegungMock } from '../daten/belegungMock.ts';
import { pruefeEntwurf } from '../utils/verfuegbarkeit.ts';

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

  // meine eigenen Buchungen (am Anfang leer)
  const [buchungen, setBuchungen] = useState<Buchung[]>([]);

  // Chat mit Bruno ist jetzt hier, damit Bruno auch meine Buchungen kennt
  const { nachrichten, isStreaming, fehler, sendeNachricht, zuruecksetzen } = useAI({
    systemPrompt: erstelleBrunoPrompt(buchungen),
    // wenn Bruno fertig ist, seinen Datenblock in den Entwurf uebernehmen
    onAntwortFertig: (antwort) => {
      const daten = leseDatenblock(antwort);
      if (daten) {
        // vorher wurde zusammengefuehrt ({ ...prev, ...daten }), dabei sind aber alte
        // Sachen haengen geblieben (z.B. Trainer, obwohl man jetzt spielen will).
        // Darum jetzt komplett ersetzen, Bruno schickt immer alles mit.
        const neu: Buchungsentwurf = { ...leererEntwurf, ...daten };

        // was nicht zur Art passt, sicherheitshalber rausnehmen
        if (neu.art === 'training') {
          neu.spielform = null;
        } else {
          neu.trainerId = null;
          neu.geraete = [];
        }
        setEntwurf(neu);
      }
    },
  });

  const handleBuchen = (): void => {
    if (!entwurf.art || !entwurf.datum || entwurf.uhrzeit === null || !entwurf.platzId) {
      return;
    }

    const platz = plaetze.find((p) => p.id === entwurf.platzId);

    // pruefen ob wirklich alles frei ist (Buchungen von allen + meine)
    const meldung = pruefeEntwurf(entwurf, [...belegungMock, ...buchungen]);
    if (meldung) {
      // statt roter Meldung sagen wir es Bruno, der sucht dann was anderes
      sendeNachricht(
        `Die Buchung hat nicht geklappt: ${platz?.name} am ${entwurf.datum} um ${entwurf.uhrzeit}:00 Uhr – ${meldung}`
      );
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

    // Bruno Bescheid sagen, dass gebucht wurde
    let text = `Ich habe gerade gebucht: ${platz?.name} am ${neueBuchung.datum} um ${neueBuchung.uhrzeit}:00 Uhr`;
    text += ` (${neueBuchung.art}) für ${neueBuchung.namen.join(', ')}.`;
    sendeNachricht(text);
  };

  // "Neues Match": Chat UND Entwurf leeren
  const handleNeuesMatch = (): void => {
    zuruecksetzen();
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
        onZuruecksetzen={handleNeuesMatch}
      />
      <BuchungsEntwurf entwurf={entwurf} onBuchen={handleBuchen} isStreaming={isStreaming} />
      <BuchungsListe buchungen={buchungen} onStornieren={handleStornieren} />
    </section>
  );
}

export default PlatzBuchung;
