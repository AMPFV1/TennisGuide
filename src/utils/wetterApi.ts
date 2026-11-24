// Holt die Wettervorhersage von Open-Meteo (https://open-meteo.com, kostenlos, ohne API-Schlüssel)
import type { Wetter, WetterArt } from '../typen/buchung.ts';

// Standort des Vereins: Wien (der Verein ist fiktiv)
const BREITE = 48.21;
const LAENGE = 16.37;

// heute + 7 Tage = der Buchungszeitraum
const TAGE = 8;

const URL =
  'https://api.open-meteo.com/v1/forecast' +
  `?latitude=${BREITE}&longitude=${LAENGE}` +
  '&daily=weather_code,temperature_2m_max' +
  `&timezone=Europe%2FVienna&forecast_days=${TAGE}`;

// So sieht die Antwort von Open-Meteo aus (nur die Felder, die wir brauchen)
interface OpenMeteoAntwort {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
  };
}

// WMO-Wettercodes in unsere vier Arten umrechnen
// (Tabelle: https://open-meteo.com/en/docs#weather_variables)
export function wetterArtAusCode(code: number): WetterArt {
  if (code <= 1) return 'sonnig'; // 0 klar, 1 überwiegend klar
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'schnee';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return 'regen';
  return 'bewoelkt'; // 2, 3 bewölkt, 45, 48 Nebel
}

// Prüft, ob die Antwort wirklich so aussieht, wie wir sie erwarten
function istOpenMeteoAntwort(daten: unknown): daten is OpenMeteoAntwort {
  if (typeof daten !== 'object' || daten === null || !('daily' in daten)) return false;
  const daily = (daten as { daily: unknown }).daily;
  if (typeof daily !== 'object' || daily === null) return false;
  const d = daily as Record<string, unknown>;
  return (
    Array.isArray(d.time) &&
    Array.isArray(d.weather_code) &&
    Array.isArray(d.temperature_2m_max) &&
    d.time.length === d.weather_code.length &&
    d.time.length === d.temperature_2m_max.length
  );
}

export async function ladeWetter(signal?: AbortSignal): Promise<Wetter[]> {
  const antwort = await fetch(URL, { signal });
  if (!antwort.ok) {
    throw new Error(`Wetter-API Fehler: ${antwort.status}`);
  }

  const daten: unknown = await antwort.json();
  if (!istOpenMeteoAntwort(daten)) {
    throw new Error('Wetter-API: unerwartetes Antwortformat');
  }

  // aus den drei parallelen Listen eine Liste von Tagen machen
  return daten.daily.time.map((datum, i) => ({
    datum,
    wetter: wetterArtAusCode(daten.daily.weather_code[i]),
    temperatur: Math.round(daten.daily.temperature_2m_max[i]),
  }));
}
