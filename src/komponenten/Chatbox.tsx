import { useEffect, useRef, useState } from 'react';
import useAI from '../hooks/useAI.ts';
import NachrichtBlaeschen from './NachrichtBlaeschen.tsx';

const MAX_ZEICHEN = 500;

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

RESERVIERUNG:
- Die Online-Reservierung ist noch in Arbeit. Du kannst selbst noch KEINE Plätze reservieren.
- Bestätige nie eine Reservierung! Sag stattdessen freundlich, dass das bald direkt hier im Chat geht.

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
