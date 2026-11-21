import { wetterMock } from '../daten/wetterMock.ts';
import { formatiereDatumKurz } from '../utils/formatierung.ts';

// Text für Screenreader (das Emoji allein sagt ihnen nichts)
const WETTER_TEXT = {
  sonnig: 'sonnig',
  bewoelkt: 'bewölkt',
  regen: 'Regen',
} as const;

function WetterLeiste(): React.JSX.Element {
  return (
    <div className='wetter-leiste'>
      {wetterMock.map((tag) => {
        // Icon je nach Wetter
        let icon = '☀️';
        if (tag.wetter === 'bewoelkt') {
          icon = '⛅';
        } else if (tag.wetter === 'regen') {
          icon = '🌧️';
        }

        return (
          <div
            key={tag.datum}
            className={tag.wetter === 'regen' ? 'wetter-tag wetter-tag--regen' : 'wetter-tag'}
          >
            <span>{formatiereDatumKurz(tag.datum)}</span>
            <span className='wetter-icon' aria-hidden='true'>
              {icon}
            </span>
            <span className='visuell-versteckt'>{WETTER_TEXT[tag.wetter]}</span>
            <span>{tag.temperatur}°</span>
            {tag.wetter === 'regen' && <span className='wetter-hinweis'>Außen gesperrt</span>}
          </div>
        );
      })}
    </div>
  );
}

export default WetterLeiste;
