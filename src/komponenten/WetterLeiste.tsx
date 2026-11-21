import type { Wetter, WetterArt } from '../typen/buchung.ts';
import type { WetterStatus } from '../hooks/useWetter.ts';
import { formatiereDatumKurz } from '../utils/formatierung.ts';

interface WetterLeisteProps {
  wetter: Wetter[];
  status: WetterStatus;
  onNeuLaden: () => void;
}

// Icon und Text für Screenreader (das Emoji allein sagt ihnen nichts)
const ANZEIGE: Record<WetterArt, { icon: string; text: string }> = {
  sonnig: { icon: '☀️', text: 'sonnig' },
  bewoelkt: { icon: '⛅', text: 'bewölkt' },
  regen: { icon: '🌧️', text: 'Regen' },
  schnee: { icon: '❄️', text: 'Schnee' },
};

// So viele Platzhalter zeigen wir beim Laden (heute + 7 Tage)
const PLATZHALTER = Array.from({ length: 8 }, (_, i) => i);

function WetterLeiste({ wetter, status, onNeuLaden }: WetterLeisteProps): React.JSX.Element {
  if (status === 'loading') {
    return (
      <div className='wetter-leiste' role='status' aria-busy='true'>
        <span className='visuell-versteckt'>Wettervorhersage wird geladen …</span>
        {PLATZHALTER.map((i) => (
          <div key={i} className='wetter-tag wetter-tag--laedt' aria-hidden='true' />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='fehler' role='alert'>
        <p>
          Die Wettervorhersage konnte gerade nicht geladen werden. Du kannst trotzdem buchen, bei
          Außenplätzen ist das Wetter dann aber nicht geprüft.
        </p>
        <button type='button' onClick={onNeuLaden}>
          Nochmal versuchen
        </button>
      </div>
    );
  }

  return (
    <div className='wetter-leiste'>
      {wetter.map((tag) => {
        const gesperrt = tag.wetter === 'regen' || tag.wetter === 'schnee';
        const { icon, text } = ANZEIGE[tag.wetter];

        return (
          <div
            key={tag.datum}
            className={gesperrt ? 'wetter-tag wetter-tag--regen' : 'wetter-tag'}
          >
            <span>{formatiereDatumKurz(tag.datum)}</span>
            <span className='wetter-icon' aria-hidden='true'>
              {icon}
            </span>
            <span className='visuell-versteckt'>{text}</span>
            <span>{tag.temperatur}°</span>
            {gesperrt && <span className='wetter-hinweis'>Außen gesperrt</span>}
          </div>
        );
      })}
    </div>
  );
}

export default WetterLeiste;
