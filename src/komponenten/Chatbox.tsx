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
  children?: React.ReactNode; // wird unter der letzten Nachricht angezeigt (z.B. Kacheln)
}

// Übersetzt den rohen API-Fehler (z. B. "API Fehler: 429") in einen verständlichen Satz
function freundlicheFehlermeldung(fehler: string): string {
  if (fehler.includes('401') || fehler.includes('403')) {
    return 'Bruno darf gerade nicht antworten (API-Schlüssel fehlt oder ist ungültig). Bitte später erneut versuchen.';
  }
  if (fehler.includes('429')) {
    return 'Bruno hat gerade viel zu tun. Bitte warte kurz und schick deine Nachricht noch einmal.';
  }
  if (/fetch|network|Failed/i.test(fehler)) {
    return 'Keine Verbindung zu Bruno. Bitte prüfe deine Internetverbindung und versuche es erneut.';
  }
  return 'Das hat leider nicht geklappt. Bitte versuche es noch einmal.';
}

function Chatbox({
  nachrichten,
  isStreaming,
  fehler,
  onSenden,
  onZuruecksetzen,
  children,
}: ChatboxProps): React.JSX.Element {
  const [eingabe, setEingabe] = useState<string>('');

  const endeRef = useRef<HTMLDivElement | null>(null);

  // auch scrollen, wenn die Kacheln auftauchen (isStreaming wird false)
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, isStreaming]);

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

        {/* Kacheln erst zeigen, wenn Bruno fertig geschrieben hat */}
        {!isStreaming && children}

        {fehler && (
          <p className='fehler' role='alert'>
            🚫 {freundlicheFehlermeldung(fehler)}
          </p>
        )}

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
