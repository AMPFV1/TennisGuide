// src/komponenten/NachrichtBlaeschen.tsx
// Eine einzelne Chat-Nachricht: ich rechts, der Platzwart links
import type { Nachricht } from '../typen/ai.ts';
import { entferneDatenblock } from '../utils/datenblock.ts';

interface NachrichtBlaeschenProps {
  nachricht: Nachricht;
}

function NachrichtBlaeschen({ nachricht }: NachrichtBlaeschenProps): React.JSX.Element {
  const istBenutzer = nachricht.role === 'user';

  return (
    <div className={istBenutzer ? 'blaeschen-zeile blaeschen-zeile--benutzer' : 'blaeschen-zeile'}>
      {!istBenutzer && <span className='blaeschen-avatar' aria-hidden='true'>🧹</span>}
      <div className={istBenutzer ? 'blaeschen blaeschen--benutzer' : 'blaeschen blaeschen--platzwart'}>
        <span className='visuell-versteckt'>{istBenutzer ? 'Du:' : 'Platzwart Bruno:'}</span>
        {/* bei Bruno den <daten>-Block nicht anzeigen */}
        <p>{istBenutzer ? nachricht.content : entferneDatenblock(nachricht.content)}</p>
      </div>
      {istBenutzer && <span className='blaeschen-avatar' aria-hidden='true'>🙋</span>}
    </div>
  );
}

export default NachrichtBlaeschen;
