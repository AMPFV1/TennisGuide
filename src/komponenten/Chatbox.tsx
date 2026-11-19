import { useEffect, useRef, useState } from 'react';
import useAI from '../hooks/useAI.ts';
import NachrichtBlaeschen from './NachrichtBlaeschen.tsx';
import { plaetze } from '../daten/plaetze.ts';
import { trainerListe } from '../daten/trainer.ts';
import { geraete } from '../daten/geraete.ts';
import { wetterMock } from '../daten/wetterMock.ts';
import { belegungMock } from '../daten/belegungMock.ts';

const MAX_ZEICHEN = 500;

// Daten als Text fuer Bruno zusammenbauen, damit er weiss was frei ist
const heute = new Date().toLocaleDateString('de-AT');

const wetterText = wetterMock
  .map((tag) => `- ${tag.datum}: ${tag.wetter}, ${tag.temperatur} Grad`)
  .join('\n');

const trainerText = trainerListe
  .map((t) => `- ${t.name} (${t.fachgebiet}), arbeitet von ${t.vonUhr}:00 bis ${t.bisUhr + 1}:00`)
  .join('\n');

const geraeteText = geraete.map((g) => `- ${g.name}: ${g.anzahl} Stück`).join('\n');

const belegungText = belegungMock
  .map((b) => {
    const platz = plaetze.find((p) => p.id === b.platzId);
    let zeile = `- ${b.datum} um ${b.uhrzeit}:00: ${platz?.name} belegt`;
    if (b.trainerId) {
      const trainer = trainerListe.find((t) => t.id === b.trainerId);
      zeile += `, Trainer ${trainer?.name} belegt`;
    }
    if (b.geraete.length > 0) {
      zeile += `, Geräte belegt: ${b.geraete.join(', ')}`;
    }
    return zeile;
  })
  .join('\n');

const SYSTEM_PROMPT = `
Du bist "Platzwart Bruno", der Platzwart vom TC Netzroller – seit 30 Jahren im Verein.
Du bist ein echter Spaßvogel: immer gut gelaunt, pfeifst beim Linienkehren und
erzählst jedem, der vorbeikommt, einen Witz. Deine Plätze sind dein ganzer Stolz –
du sprichst von ihnen wie von deinen Kindern und gibst ihnen manchmal Spitznamen.
Wer mit Straßenschuhen auf den Sand will, bekommt von dir keinen Ärger, sondern einen
lustigen Spruch und einen freundlichen Hinweis.

DEINE AUFGABE:
- Beantworte Fragen zu den Plätzen: welche Plätze es gibt, Belag, Öffnungszeiten, Platzregeln
- Hilf bei Fragen rund um die Platzreservierung
- Beantworte auch allgemeine Tennisfragen (Regeln, Zählweise, Ausrüstung)
- Merke dir, was die Person dir im Gespräch erzählt (Name, wann sie spielen will)

DIE PLÄTZE:
- Außenplätze: Platz 1, Platz 2 und Platz 3 (Sand), nur bei trockenem Wetter bespielbar
- Hallenplätze: Halle 1, Halle 2 und Halle 3, das ganze Jahr bespielbar
- Spielzeiten: täglich von 8:00 bis 22:00 Uhr, gebucht wird immer eine ganze Stunde

PLATZREGELN:
- Nur mit Tennisschuhen auf den Platz (auf Sand: Sandplatzschuhe)
- Nach dem Spielen wird der Sandplatz abgezogen und die Linien werden gekehrt
- Nach starkem Regen sind die Außenplätze gesperrt, bis Bruno sie freigibt

HEUTE IST: ${heute}
Gebucht werden kann nur von heute bis 7 Tage im Voraus.

WETTER:
${wetterText}
Bei Regen sind die Außenplätze gesperrt!

TRAINER:
${trainerText}

TRAININGSGERÄTE:
${geraeteText}

SCHON BELEGT (alles andere ist frei):
${belegungText}

RESERVIERUNG:
- Es gibt zwei Arten: Spielen oder Training
- Spielen: Einzel (2 Personen) oder Doppel (4 Personen)
- Training: 1 bis 4 Personen, immer mit Platz, optional mit Trainer und Trainingsgeräten
- Frage nacheinander alles ab, was noch fehlt: Spielen oder Training, Einzel oder Doppel,
  an welchem Tag, um welche Uhrzeit, welcher Platz, die Namen aller Personen,
  und beim Training ob ein Trainer und welche Geräte dazu sollen
- Schlage nur Plätze, Trainer und Geräte vor, die zu der Zeit frei sind
- Wenn du alles weißt, fasse die Buchung kurz zusammen
- Du kannst selbst noch nicht buchen. Bestätige nie eine Buchung!

FORMAT:
- Antworte immer auf Deutsch
- Maximal 80 Wörter pro Antwort

EINSCHRÄNKUNGEN:
- Bei Fragen ohne Tennisbezug: kurz und lustig antworten und dann gut gelaunt zurück zum Thema ("Aber jetzt zurück auf den Platz!")
- Keine medizinischen Diagnosen: bei Schmerzen immer zum Arzt oder zur Physiotherapie schicken
`.trim();

function Chatbox(): React.JSX.Element {
  const [eingabe, setEingabe] = useState<string>('');
  const { nachrichten, isStreaming, fehler, sendeNachricht, zuruecksetzen } = useAI({
    systemPrompt: SYSTEM_PROMPT,
  });

  const endeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten]);

  const handleSenden = async (): Promise<void> => {
    if (!eingabe.trim()) return;
    const text = eingabe;
    setEingabe('');
    await sendeNachricht(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSenden();
    }
  };

  const letzte = nachrichten[nachrichten.length - 1];
  const isTippt = isStreaming && letzte?.role === 'assistant' && letzte.content === '';

  return (
    <section className='chatbox' aria-labelledby='chatbox-titel'>
      <header className='chatbox-kopf'>
        <h2 id='chatbox-titel'>🧹 Platzwart Bruno</h2>
        <small className='ki-hinweis'>KI-Chatbot · Antworten sind KI-generiert</small>
      </header>

      <div className='chatbox-verlauf' aria-live='polite' aria-busy={isStreaming}>
        {nachrichten.length === 0 && (
          <p className='chatbox-leer'>
            Servus, ich bin Bruno, der Platzwart vom TC Netzroller. 🧹 Frag mich
            alles über unsere Plätze – aber bitte nicht mit Straßenschuhen!
          </p>
        )}

        {nachrichten.map((nachricht, index) =>
          isTippt && index === nachrichten.length - 1 ? null : (
            <NachrichtBlaeschen key={index} nachricht={nachricht} />
          )
        )}

        {isTippt && <p className='chatbox-tippt'>Bruno stellt den Rechen weg …</p>}

        {fehler && <p className='fehler'>🚫 Doppelfehler! {fehler}</p>}

        <div ref={endeRef} />
      </div>

      <div className='chatbox-eingabe'>
        <label htmlFor='chatbox-feld' className='visuell-versteckt'>
          Nachricht an Platzwart Bruno
        </label>
        <input
          id='chatbox-feld'
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Nachricht eingeben...'
          maxLength={MAX_ZEICHEN}
          disabled={isStreaming}
        />
        <button onClick={handleSenden} disabled={isStreaming || !eingabe.trim()}>
          Aufschlag 🎾
        </button>
        <button onClick={zuruecksetzen} disabled={isStreaming}>
          Neues Match
        </button>
      </div>
      <p className='chatbox-zaehler'>
        {eingabe.length} / {MAX_ZEICHEN} Zeichen
      </p>
    </section>
  );
}

export default Chatbox;
