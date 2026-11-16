import { useState } from 'react';
import type { Nachricht } from '../typen/ai.ts';
import { chatStream } from '../utils/aiStream.ts';

interface UseAIOptionen {
  systemPrompt?: string;
  maxNachrichten?: number;
}

interface UseAIErgebnis {
  nachrichten: Nachricht[];
  isStreaming: boolean;
  fehler: string | null;
  sendeNachricht: (inhalt: string) => Promise<void>;
  zuruecksetzen: () => void;
}

function useAI(optionen: UseAIOptionen = {}): UseAIErgebnis {
  const { systemPrompt, maxNachrichten = 20 } = optionen;

  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const sendeNachricht = async (inhalt: string): Promise<void> => {
    if (!inhalt.trim() || isStreaming) return;

    const benutzerNachricht: Nachricht = { role: 'user', content: inhalt };

    const kiNachricht: Nachricht = { role: 'assistant', content: '' };

    const verlauf = [...nachrichten, benutzerNachricht].slice(-maxNachrichten);

    setNachrichten((prev) => [...prev, benutzerNachricht, kiNachricht]);
    setFehler(null);
    setIsStreaming(true);

    const alleNachrichten: Nachricht[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...verlauf]
      : verlauf;

    await chatStream(
      alleNachrichten,

      (text) => {
        setNachrichten((prev) => {
          const neu = [...prev];
          const letzte = neu[neu.length - 1];
          neu[neu.length - 1] = { ...letzte, content: letzte.content + text };
          return neu;
        });
      },
      // fertig
      () => setIsStreaming(false),
      // fehler
      (err) => {
        setFehler(err.message);
        setIsStreaming(false);
        setNachrichten((prev) => {
          const letzte = prev[prev.length - 1];
          if (letzte && letzte.role === 'assistant' && letzte.content === '') {
            return prev.slice(0, -1);
          }
          return prev;
        });
      }
    );
  };

  const zuruecksetzen = (): void => {
    setNachrichten([]);
    setFehler(null);
    setIsStreaming(false);
  };

  return { nachrichten, isStreaming, fehler, sendeNachricht, zuruecksetzen };
}

export default useAI;
