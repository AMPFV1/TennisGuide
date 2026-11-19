import { useEffect, useRef, useState } from 'react';
import type { Nachricht } from '../typen/ai.ts';
import NachrichtBlaeschen from './NachrichtBlaeschen.tsx';

const MAX_ZEICHEN = 500;

// Der Chat selbst (useAI) ist jetzt in der Seite PlatzBuchung,
// die Chatbox zeigt nur noch an und gibt die Eingabe weiter
interface ChatboxProps {
  nachrichten: Nachricht[];
  isStreaming: boolean;
  fehler: string | null;
  onSenden: (text: string) => Promise<void>;
  onZuruecksetzen: () => void;
}

function Chatbox({
  nachrichten,
  isStreaming,
  fehler,
  onSenden,
  onZuruecksetzen,
}: ChatboxProps): React.JSX.Element {
  const [eingabe, setEingabe] = useState<string>('');

  const endeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten]);

  const handleSenden = async (): Promise<void> => {
    if (!eingabe.trim()) return;
    const text = eingabe;
    setEingabe('');
    await onSenden(text);
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
        <button onClick={onZuruecksetzen} disabled={isStreaming}>
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
