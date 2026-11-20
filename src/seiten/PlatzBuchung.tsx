import { useState } from 'react';
import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';
import BuchungsEntwurf from '../komponenten/BuchungsEntwurf.tsx';
import BuchungsListe from '../komponenten/BuchungsListe.tsx';
import KachelListe from '../komponenten/KachelListe.tsx';
import type { Buchung, Buchungsentwurf, Kachel } from '../typen/buchung.ts';
import useAI from '../hooks/useAI.ts';
import { erstelleBrunoPrompt } from '../utils/brunoPrompt.ts';
import { leseDatenblock, leseKacheln } from '../utils/datenblock.ts';
import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import { belegungMock } from '../daten/belegungMock.ts';
import { ergaenzeKacheln, pruefeEntwurf } from '../utils/verfuegbarkeit.ts';
import {
  formatiereArt,
  formatiereDatumMitTag,
  formatiereSpielform,
  formatiereUhrzeit,
} from '../utils/formatierung.ts';

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

  // Vorschlaege von Bruno zum Anklicken
  const [kacheln, setKacheln] = useState<Kachel[]>([]);

  // Buchungen von allen anderen + meine (fuer die Pruefungen)
  const alleBuchungen = [...belegungMock, ...buchungen];

  // Chat mit Bruno ist jetzt hier, damit Bruno auch meine Buchungen kennt
  const { nachrichten, isStreaming, fehler, sendeNachricht, zuruecksetzen } = useAI({
    systemPrompt: erstelleBrunoPrompt(buchungen),
    // wenn Bruno fertig ist, seinen Datenblock in den Entwurf uebernehmen
    onAntwortFertig: (antwort) => {
      // neue Kacheln (oder keine) von Bruno
      setKacheln(leseKacheln(antwort));

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
    const meldung = pruefeEntwurf(entwurf, alleBuchungen);
    if (meldung) {
      // statt roter Meldung sagen wir es Bruno, der sucht dann was anderes
      sendeNachricht(
        `Die Buchung hat nicht geklappt: ${platz?.name} am ${formatiereDatumMitTag(entwurf.datum)} um ${formatiereUhrzeit(entwurf.uhrzeit)} – ${meldung}`
      );
      return;
    }

    // naechste freie Nummer (hoechste id + 1)
    const neueId = buchungen.length > 0 ? Math.max(...buchungen.map((b) => b.id)) + 1 : 1;

    const neueBuchung: Buchung = {
      id: neueId,
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
    let text = `Ich habe gerade gebucht: ${platz?.name} am ${formatiereDatumMitTag(neueBuchung.datum)}`;
    text += ` um ${formatiereUhrzeit(neueBuchung.uhrzeit)} (${formatiereArt(neueBuchung.art)})`;
    text += ` für ${neueBuchung.namen.join(', ')}.`;
    sendeNachricht(text);
  };

  // "Neues Match": Chat, Entwurf und Kacheln leeren
  const handleNeuesMatch = (): void => {
    zuruecksetzen();
    setEntwurf(leererEntwurf);
    setKacheln([]);
  };

  // wenn man selber was tippt, sind die alten Kacheln nicht mehr aktuell
  const handleSenden = async (text: string): Promise<void> => {
    setKacheln([]);
    await sendeNachricht(text);
  };

  // Klick auf eine Kachel: in den Entwurf eintragen und Bruno Bescheid sagen
  const handleKachelKlick = (kachel: Kachel): void => {
    const neu: Buchungsentwurf = { ...entwurf };
    let text = 'Ich nehme: ';

    if (kachel.typ === 'art') {
      neu.art = kachel.art;
      if (kachel.art === 'training') {
        neu.spielform = null;
      } else {
        neu.trainerId = null;
        neu.geraete = [];
      }
      text += formatiereArt(kachel.art);
    } else if (kachel.typ === 'spielform') {
      neu.spielform = kachel.spielform;
      text += formatiereSpielform(kachel.spielform);
    } else if (kachel.typ === 'termin') {
      neu.datum = kachel.datum;
      neu.uhrzeit = kachel.uhrzeit;
      neu.platzId = kachel.platzId;
      const platz = plaetze.find((p) => p.id === kachel.platzId);
      text += `${platz?.name} am ${formatiereDatumMitTag(kachel.datum)} um ${formatiereUhrzeit(kachel.uhrzeit)}`;
    } else if (kachel.typ === 'trainer') {
      neu.trainerId = kachel.trainerId;
      const trainer = trainerListe.find((t) => t.id === kachel.trainerId);
      text += trainer ? `Trainer ${trainer.name}` : 'ohne Trainer';
    } else {
      // Geraete nur an- und abwaehlen, Bruno bekommt erst bei "Fertig" Bescheid
      if (neu.geraete.includes(kachel.geraetId)) {
        neu.geraete = neu.geraete.filter((id) => id !== kachel.geraetId);
      } else {
        neu.geraete = [...neu.geraete, kachel.geraetId];
      }
      setEntwurf(neu);
      return;
    }

    setEntwurf(neu);
    handleSenden(text);
  };

  // "Fertig" bei den Geraeten: jetzt Bruno sagen, welche es sind
  const handleGeraeteFertig = (): void => {
    if (entwurf.geraete.length === 0) {
      handleSenden('Ich nehme: keine Geräte');
      return;
    }
    const namen = geraete.filter((g) => entwurf.geraete.includes(g.id)).map((g) => g.name);
    handleSenden(`Ich nehme die Geräte: ${namen.join(', ')}`);
  };

  // Am Anfang (leerer Chat) gleich Spielen oder Training anbieten, ohne Bruno zu fragen
  const startKacheln: Kachel[] = [
    { typ: 'art', art: 'spielen' },
    { typ: 'art', art: 'training' },
  ];
  const angezeigteKacheln =
    nachrichten.length === 0 ? startKacheln : ergaenzeKacheln(kacheln, entwurf, alleBuchungen);

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
        onSenden={handleSenden}
        onZuruecksetzen={handleNeuesMatch}
      >
        <KachelListe
          kacheln={angezeigteKacheln}
          entwurf={entwurf}
          alleBuchungen={alleBuchungen}
          onKlick={handleKachelKlick}
          onGeraeteFertig={handleGeraeteFertig}
        />
      </Chatbox>
      <BuchungsEntwurf entwurf={entwurf} onBuchen={handleBuchen} isStreaming={isStreaming} />
      <BuchungsListe buchungen={buchungen} onStornieren={handleStornieren} />
    </section>
  );
}

export default PlatzBuchung;