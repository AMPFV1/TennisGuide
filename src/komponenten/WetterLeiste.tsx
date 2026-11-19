import { wetterMock } from '../daten/wetterMock.ts';

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

        // aus 2026-11-20 wird 20.11.
        const teile = tag.datum.split('-');
        const datumText = `${teile[2]}.${teile[1]}.`;

        return (
          <div key={tag.datum} className='wetter-tag'>
            <span>{datumText}</span>
            <span className='wetter-icon'>{icon}</span>
            <span>{tag.temperatur}°</span>
          </div>
        );
      })}
    </div>
  );
}

export default WetterLeiste;
