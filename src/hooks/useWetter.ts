import { useEffect, useState } from 'react';
import type { Wetter } from '../typen/buchung.ts';
import { ladeWetter } from '../utils/wetterApi.ts';

export type WetterStatus = 'loading' | 'success' | 'error';

interface UseWetterErgebnis {
  wetter: Wetter[];
  status: WetterStatus;
  neuLaden: () => void; // für den Button "Nochmal versuchen"
}

// Antwort der Wetter-API, markiert mit dem Versuch, zu dem sie gehört
interface Antwort {
  versuch: number;
  tage: Wetter[] | null; // null = Fehler
}

// Lädt die Wettervorhersage und merkt sich, ob sie noch lädt, da ist oder fehlgeschlagen ist
function useWetter(): UseWetterErgebnis {
  // wird bei "Nochmal versuchen" hochgezählt und löst den Effekt neu aus
  const [versuch, setVersuch] = useState<number>(0);
  const [antwort, setAntwort] = useState<Antwort | null>(null);

  useEffect(() => {
    // Abbruch, falls die Seite verlassen wird, bevor die Antwort da ist
    const abbruch = new AbortController();

    ladeWetter(abbruch.signal)
      .then((tage) => setAntwort({ versuch, tage }))
      .catch(() => {
        if (!abbruch.signal.aborted) setAntwort({ versuch, tage: null });
      });

    return () => abbruch.abort();
  }, [versuch]);

  // Der Status wird beim Rendern abgeleitet: Solange keine Antwort zum aktuellen Versuch da ist, lädt es
  let status: WetterStatus = 'loading';
  if (antwort !== null && antwort.versuch === versuch) {
    status = antwort.tage === null ? 'error' : 'success';
  }
  const wetter = status === 'success' && antwort?.tage ? antwort.tage : [];

  const neuLaden = (): void => setVersuch((v) => v + 1);

  return { wetter, status, neuLaden };
}

export default useWetter;
