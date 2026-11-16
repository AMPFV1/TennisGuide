import type { Nachricht } from '../typen/ai.ts';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

//export const STANDARD_MODELL = 'google/gemma-4-31b-it:free';
const MODELL = 'nvidia/nemotron-3.5-super-vl:free';

export async function chatStream(
  nachrichten: Nachricht[],
  onChunk: (text: string) => void,
  onFertig: () => void, 
  onFehler: (fehler: Error) => void 
): Promise<void> {
  try {

    const antwort = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODELL,
        messages: nachrichten,
        stream: true, // Streaming einschalten
      }),
    });

    if (!antwort.ok) {
      throw new Error(`API Fehler: ${antwort.status}`);
    }

    const reader = antwort.body?.getReader();
    if (!reader) {
      throw new Error('Kein Stream vorhanden');
    }

    const decoder = new TextDecoder();
    let puffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onFertig();
        break;
      }

      puffer += decoder.decode(value, { stream: true });
      const zeilen = puffer.split('\n');
      puffer = zeilen.pop() ?? '';

      for (const zeile of zeilen) {
        if (!zeile.startsWith('data: ')) continue;

        const daten = zeile.slice(6).trim();

        if (daten === '[DONE]') {
          onFertig();
          return;
        }

        try {
          const json = JSON.parse(daten);
          const text = json.choices?.[0]?.delta?.content;
          if (text) {
            onChunk(text);
          }
        } catch {
          // Leere Zeilen oder unvollstaendige JSON-Pakete ignorieren 
        }
      }
    }
  } catch (fehler) {
    onFehler(fehler instanceof Error ? fehler : new Error('Unbekannter Fehler'));
  }
}
