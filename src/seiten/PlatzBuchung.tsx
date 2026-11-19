import Chatbox from '../komponenten/Chatbox.tsx';
import WetterLeiste from '../komponenten/WetterLeiste.tsx';

function PlatzBuchung(): React.JSX.Element {
  return (
    <section>
      <h2>Platz buchen</h2>
      <p>
        Fragen zu unseren Plätzen? Unser Platzwart Bruno hilft dir gerne weiter.
        Bald kann er auch direkt für dich reservieren.
      </p>
      <h3>Wetter</h3>
      <WetterLeiste />
      <Chatbox />
    </section>
  );
}

export default PlatzBuchung;
