import { wetterMock } from '../daten/wetterMock.ts';
import { formatiereDatumKurz } from '../utils/formatierung.ts';

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
          <div key={tag.datum} className='wetter-tag'>
            <span>{formatiereDatumKurz(tag.datum)}</span>
            <span className='wetter-icon'>{icon}</span>
            <span>{tag.temperatur}°</span>
          </div>
        );
      })}
    </div>
  );
}

export default WetterLeiste;
